class Job {
  constructor(options) {
    this.logger = options.logger;
    this.interval = options.interval;
    this.name = options.name;
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

  log(message, level = 'info') {
    this.logger.log(level, `${this.name}: ${message}`);
  }

  /* eslint-disable class-methods-use-this,no-console */
  run() {
    console.log('Oops! Did you forget to implement the run method?');
  }
}

module.exports = { Job };
