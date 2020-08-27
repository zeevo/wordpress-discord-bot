class Job {
  constructor(options) {
    this.logger = options.logger;
    this.interval = options.interval;
    this.name = options.name;
    this.running = false;
  }

  async start() {
    this.job = setInterval(async () => {
      this.log('Job start.');
      try {
        if (!this.running) {
          this.running = true;
          await this.run();
          this.running = false;
        } else {
          this.log('Job already running. Skipping this execution');
        }
      } catch (e) {
        this.logger.error(e);
        this.running = false;
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
