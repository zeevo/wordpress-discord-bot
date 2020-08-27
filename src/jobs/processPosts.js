const Meta = require('html-metadata-parser');
const { Job } = require('.');

const lookupMetaInfo = (url) => {
  return Meta.parser(url);
};

class ProcessPostsJob extends Job {
  constructor({ interval, database, logger, client, wp, name = 'ProcessPostsJob' }) {
    super({ interval, database, logger, client, wp, name });
    this.interval = interval;
    this.database = database;
    this.logger = logger;
    this.client = client;
    this.wp = wp;
  }

  async run() {
    this.log('Job: Processing posts...');
    // Send the data from the database to Wordpress
    const { Post } = this.database;
    const postsToProcess = await Post.findAll({
      where: {
        processed: false,
      },
    });

    await new Promise((r) => setTimeout(r, 9000));

    if (!postsToProcess.length) {
      this.log('No new posts to process found...');
    } else {
      /* eslint-disable */
      for (const post of postsToProcess) {
        this.log(`Processing post ${post.discordId}`);
        try {
          const { meta, og } = await lookupMetaInfo(post.url);
          const categories = await this.wp.getAllCategories();
          const category = categories.find((cat) => post.channelDiscordName === cat.name);
          await this.wp.createPost({
            title: meta.title || og.title || post.url,
            content: meta.description || og.description || post.content,
            categories: [category.id],
            status: 'draft',
            acf: {
              url: post.url,
              authorusername: post.authorDiscordUsername,
              authordescriminator: post.authorDiscordDiscriminator,
              authorid: post.authorDiscordId,
              createdtimestamp: post.createdTimestamp,
            },
          });
          await post.update({ processed: true });
          await post.save();
        } catch (e) {
          this.log(e, 'error');
        }
      }
    }
  }
}

module.exports = ProcessPostsJob;
