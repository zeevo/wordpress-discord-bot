let running = false;

class Job {
  constructor(options) {
    this.logger = options.logger;
    this.interval = options.interval;
    this.name = options.name;
  }

  async start() {
    this.job = setInterval(async () => {
      try {
        if (!running) {
          running = true;
          this.log('Job start.');
          await this.run();
        } else {
          this.log('Job already running. Skipping this execution');
        }
      } catch (e) {
        this.logger.error(e);
      } finally {
        this.log('Job End.');
        running = false;
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
