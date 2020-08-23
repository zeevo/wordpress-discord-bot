const { Sequelize } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('post', {
    url: {
      type: Sequelize.TEXT,
    },
  });
};
