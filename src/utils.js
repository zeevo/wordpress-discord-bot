const { getMetadata } = require('page-metadata-parser');
const domino = require('domino');
const fetch = require('node-fetch');

const URL = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
const urlMatcher = new RegExp(URL);

const isUrl = (url) => {
  return url.match(urlMatcher);
};

const lookupMetaInfo = async (url) => {
  const response = await fetch(url);
  const html = await response.text();
  const doc = domino.createWindow(html).document;
  const metadata = getMetadata(doc, url);
  return metadata;
};

const isValidMessage = (message) => {
  return !message.author.bot && isUrl(message.content);
};

module.exports = {
  isUrl,
  lookupMetaInfo,
  isValidMessage,
};
