require('dotenv').config();

const Discord = require('discord.js');
const logger = require('./logger');
const wp = require('./wp');
const db = require('./db');

const CollectPostJob = require('./jobs/collectPosts');
const ProcessPostsJob = require('./jobs/processPosts');
const { isUrl } = require('./utils');

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
  const database = await db();

  const collectPostJob = new CollectPostJob({
    logger,
    database,
    client,
    interval: 5000,
  });

  const processPostJob = new ProcessPostsJob({
    logger,
    database,
    client,
    wp,
    interval: 5000,
  });

  collectPostJob.start();
  processPostJob.start();
});
