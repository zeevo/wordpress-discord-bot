class Job {
  constructor(options) {
    this.logger = options.logger;
    this.interval = options.interval;
  }

  async start() {
    this.job = setInterval(async () => {
      try {
        await this.run();
      } catch (e) {
        this.logger.error(e);
      }
    }, this.interval);
  }

  /* eslint-disable class-methods-use-this,no-console */
  run() {
    console.log('Oops! Did you forget to implement the run method?');
  }
}

module.exports = { Job };
