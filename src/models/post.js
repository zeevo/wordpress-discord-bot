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
    // Discord Meta fields
    authorDiscordUsername: {
      type: Sequelize.STRING,
    },
    authorDiscordId: {
      type: Sequelize.STRING,
    },
    authorDiscordDiscriminator: {
      type: Sequelize.STRING,
    },
    createdTimestamp: {
      type: Sequelize.DATE,
    },
    channelDiscordId: {
      type: Sequelize.STRING,
    },
    channelDiscordName: {
      type: Sequelize.STRING,
    },
  });
};
