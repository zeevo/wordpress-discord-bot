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
        return channel.type === 'text';
      })
      .forEach(async (chl) => {
        const { name } = chl;
        if (!existingCategoryNames.includes(name)) {
          this.log(`Creating new channel ${name}`);
          await this.wp.createCategory(name);
        }
      });
  }
}

module.exports = CollectChannelsJob;
