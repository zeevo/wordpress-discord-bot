const { Op } = require('sequelize');
const { isUrl } = require('../utils');
const { Job } = require('.');

const isValidMessage = (message) => {
  return !message.author.bot && isUrl(message.content);
};

class CollectPostsJob extends Job {
  constructor(options) {
    super(options);
    const { interval, database, logger, client } = options;
    this.interval = interval;
    this.database = database;
    this.logger = logger;
    this.client = client;
  }

  async run() {
    this.logger.info('Job: Collecting posts...');
    const { Post } = this.database;
    this.client.channels.cache
      .filter((channel) => {
        return channel.type === 'text';
      })
      .forEach(async (chl) => {
        const channel = await chl.fetch();
        const messages = await channel.messages.fetch({ limit: 50 });
        const content = messages.filter(isValidMessage);
        content.forEach(async (ct) => {
          const { author } = ct;
          const post = await Post.findAll({
            where: {
              [Op.or]: [
                {
                  discordId: {
                    [Op.eq]: ct.id,
                  },
                },
                {
                  url: {
                    [Op.eq]: ct.content,
                  },
                },
              ],
            },
          });
          if (!post.length) {
            this.logger.info(`Found new message ${ct.content}`);
            await Post.create({
              content: ct.content,
              url: ct.content,
              authorUserName: `${author.username}#${author.discriminator}`,
              authorDiscordId: author.id,
              discordId: ct.id,
              createdTimestamp: ct.createdTimestamp,
              channelDiscordId: channel.id,
              channelName: channel.name,
            });
          }
        });
      });
  }
}

module.exports = CollectPostsJob;
