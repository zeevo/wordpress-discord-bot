const { Sequelize } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('post', {
    discordId: {
      type: Sequelize.STRING,
    },
    processed: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    url: {
      type: Sequelize.STRING,
    },
    content: {
      type: Sequelize.TEXT,
    },
    authorUserName: {
      type: Sequelize.STRING,
    },
    authorDiscordId: {
      type: Sequelize.STRING,
    },
    createdTimestamp: {
      type: Sequelize.DATE,
    },
    channelDiscordId: {
      type: Sequelize.STRING,
    },
    channelName: {
      type: Sequelize.STRING,
    },
  });
};
