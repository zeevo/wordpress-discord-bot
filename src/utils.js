/* eslint-disable no-useless-escape */
const URL = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
const urlMatcher = new RegExp(URL);

const isUrl = (url) => {
  return url.match(urlMatcher);
};

module.exports = {
  isUrl,
};
