class Job {
  constructor(options) {
    this.logger = options.logger;
  }

  start() {
    this.job = setInterval(async () => {
      try {
        this.run.bind(this);
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
