const Meta = require('html-metadata-parser');
const { Job } = require('.');

const lookupMetaInfo = (url) => {
  return Meta.parser(url);
};

class ProcessPostsJob extends Job {
  constructor(options) {
    super(options);
    const { interval, database, logger, client, wp } = options;
    this.interval = interval;
    this.database = database;
    this.logger = logger;
    this.client = client;
    this.wp = wp;
  }

  start() {
    this.job = setInterval(this.run.bind(this), this.interval);
  }

  async run() {
    this.logger.info('Job: Processing posts...');
    // Send the data from the database to Wordpress
    const { Post } = this.database;
    const postsToProcess = await Post.findAll({
      where: {
        processed: false,
      },
    });

    if (!postsToProcess.length) {
      this.logger.info('No new posts to process found...');
    }

    postsToProcess.reduce(async (accum, post) => {
      await accum;
      this.logger.info(`Processing post ${post.discordId}`);
      try {
        const { meta, og } = await lookupMetaInfo(post.url);
        await this.wp.createPost({
          title: meta.title || og.title || post.url,
          content: meta.description || og.description || post.content,
          url: post.url,
          status: 'draft',
        });
        await post.update({ processed: true });
        return post.save();
      } catch (e) {
        this.logger.error(e);
        return Promise.resolve();
      }
    }, Promise.resolve());
  }
}

module.exports = ProcessPostsJob;
