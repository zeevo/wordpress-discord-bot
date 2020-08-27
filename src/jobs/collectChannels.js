const { Job } = require('.');

class CollectChannelsJob extends Job {
  constructor({ interval, database, logger, client, wp, name = 'CollectChannelsJob' }) {
    super({ interval, database, logger, client, wp, name });
    this.interval = interval;
    this.database = database;
    this.logger = logger;
    this.client = client;
    this.wp = wp;
  }

  async run() {
    this.log('Collecting Channels');
    const existingCategories = await this.wp.getAllCategories();
    const existingCategoryNames = existingCategories.map((category) => category.name);
    this.client.channels.cache
      .filter((channel) => {
        return (
          channel.type === 'text' &&
          channel.name.toLowerCase() !== 'general' &&
          !existingCategoryNames.includes(channel.name)
        );
      })
      .reduce(async (accum, chl) => {
        await accum;
        const { name } = chl;
        this.log(`Creating new channel ${name}`);
        return this.wp.createCategory(name);
      }, Promise.resolve());
  }
}

module.exports = CollectChannelsJob;
