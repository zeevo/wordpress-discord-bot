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

  async createPost(post) {
    const wpPost = await this.api.posts().create({
      title: post.content,
      content: post.content,
      status: 'draft',
    });
    return this.api
      .acfUrl()
      .id(wpPost.id)
      .create({
        fields: {
          url: post.url,
        },
      });
  }
}

module.exports = new Wordpress();
