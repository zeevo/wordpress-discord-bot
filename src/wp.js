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

  async createPost({ title, content, acf, status, categories }) {
    try {
      const wpPost = await this.api.posts().create({
        title,
        content,
        status,
        categories,
      });
      return this.api
        .acfUrl()
        .id(wpPost.id)
        .create({
          fields: {
            ...acf,
          },
        });
    } catch (e) {
      logger.error(e);
      return null;
    }
  }

  async getAllCategories() {
    try {
      const categories = await this.api.categories().get();
      return categories;
    } catch (e) {
      logger.error(e);
      return null;
    }
  }

  async createCategory(name) {
    try {
      const res = await this.api.categories().create({
        name,
      });
      return res;
    } catch (e) {
      logger.error(e);
      return null;
    }
  }
}

module.exports = new Wordpress();
