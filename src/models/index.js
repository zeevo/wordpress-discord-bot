const Post = require('./post');

module.exports = (sequelize) => {
  return {
    Post: Post(sequelize),
  };
};
