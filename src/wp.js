const WPAPI = require('wpapi');
const logger = require('./logger');

class Wordpress {
  constructor() {
    const api = new WPAPI({
      endpoint: process.env.WP_SITE,
      username: process.env.WP_USER,
      password: process.env.WP_PASS,
    });
    api.acfUrl = api.registerRoute('acf/v3', '/posts/(?P<id>)/url');
    this.api = api;
  }

  async createPost({ title, content, url, status }) {
    try {
      const wpPost = await this.api.posts().create({
        title,
        content,
        status,
      });
      return this.api.acfUrl().id(wpPost.id).create({
        fields: {
          url,
        },
      });
    } catch (e) {
      logger.error(e);
      return null;
    }
  }
}

module.exports = new Wordpress();
