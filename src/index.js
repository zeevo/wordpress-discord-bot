require('dotenv').config();

const Discord = require('discord.js');
const { Op } = require('sequelize');
const logger = require('./logger');
const wp = require('./wp');
const db = require('./db');
const { isUrl, lookupMetaInfo, isValidMessage } = require('./utils');

const client = new Discord.Client();

client.on('ready', () => {
  logger.info(`Logged in as ${client.user.tag}!`);
});

client.on('message', async (msg) => {
  if (msg.author.bot) {
    return;
  }
  logger.info({ message: msg.content, author: msg.author.id });

  const { content } = msg;
  if (isUrl(content)) {
    await msg.reply("That's a link");
  } else {
    await msg.reply('Ack');
  }
});

client.login(process.env.TOKEN).then(async () => {
  setInterval(async () => {
    logger.info('Collection posts...');
    const { Post } = await db();
    client.channels.cache
      .filter((channel) => {
        return channel.type === 'text';
      })
      .forEach(async (chl) => {
        const channel = await chl.fetch();
        const messages = await channel.messages.fetch({ limit: 50 });
        const content = messages.filter(isValidMessage);
        content.forEach(async (ct) => {
          const { author } = ct;
          const post = await Post.findAll({
            where: {
              [Op.or]: [
                {
                  discordId: {
                    [Op.eq]: ct.id,
                  },
                },
                {
                  url: {
                    [Op.eq]: ct.content,
                  },
                },
              ],
            },
          });
          if (!post.length) {
            logger.info('Found new message');
            await Post.create({
              content: ct.content,
              url: ct.content,
              authorUserName: `${author.username}#${author.discriminator}`,
              authorDiscordId: author.id,
              discordId: ct.id,
              createdTimestamp: ct.createdTimestamp,
              channelDiscordId: channel.id,
              channelName: channel.name,
            });
          }
        });
      });
  }, 30000);

  setInterval(async () => {
    // Send the data from the database to Wordpress
    logger.info('Processing posts...');
    const { Post } = await db();
    const postsToProcess = await Post.findAll({
      where: {
        processed: false,
      },
    });

    postsToProcess.reduce(async (accum, post) => {
      await accum;
      logger.info(`Processing post ${post.discordId}`);
      await wp.createPost(post);
      await post.update({
        processed: true,
      });
      return post.save();
    }, Promise.resolve());
  }, 30000);
});
