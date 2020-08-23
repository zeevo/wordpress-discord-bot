require('dotenv').config();
const Discord = require('discord.js');

const logger = require('./logger');
const db = require('./db');

const URL = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
const urlMatcher = new RegExp(URL);

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
  if (content.match(urlMatcher)) {
    await msg.reply("That's a link");
  } else {
    await msg.reply('Ack');
  }
});

client.login(process.env.TOKEN);
