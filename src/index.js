require('dotenv').config();

const Discord = require('discord.js');
const logger = require('./logger');
const wp = require('./wp');
const db = require('./db');

const CollectPostsJob = require('./jobs/collectPosts');
const ProcessPostsJob = require('./jobs/processPosts');
const CollectChannelsJob = require('./jobs/collectChannels');
const { isUrl } = require('./utils');

const client = new Discord.Client();

client.on('ready', () => {
  logger.info(`Logged in as ${client.user.tag}!`);
});

client.on('message', async (msg) => {
  if (msg.author.bot) {
    return;
  }
  const { content } = msg;
  if (isUrl(content)) {
    await msg.reply("That's a link");
  } else {
    await msg.reply('Ack');
  }
});

client.login(process.env.TOKEN).then(async () => {
  const database = await db();

  const collectPostJob = new CollectPostsJob({
    logger,
    database,
    client,
    interval: 30000,
  });

  const processPostJob = new ProcessPostsJob({
    logger,
    database,
    client,
    wp,
    interval: 40000,
  });

  const collectChannelsJob = new CollectChannelsJob({
    logger,
    database,
    client,
    wp,
    interval: 120000,
  });

  await collectChannelsJob.run();
  collectChannelsJob.start();
  collectPostJob.start();
  processPostJob.start();
});
