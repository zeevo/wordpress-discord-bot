const Meta = require('html-metadata-parser');

const URL = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
const urlMatcher = new RegExp(URL);

const isUrl = (url) => {
  return url.match(urlMatcher);
};

const lookupMetaInfo = (url) => {
  return Meta.parser(url);
};

const isValidMessage = (message) => {
  return !message.author.bot && isUrl(message.content);
};

module.exports = {
  isUrl,
  lookupMetaInfo,
  isValidMessage,
};
