const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('sqlite://./db.sqlite3', {
  logging: () => {},
});

const Models = require('./models')(sequelize);

let synced = false;

module.exports = async () => {
  if (!synced) {
    Object.keys(Models).reduce(async (accum, model) => {
      await accum;
      return Models[model].sync({ force: process.env.DB_ACTION === 'force' });
    }, Promise.resolve());
    synced = true;
  }
  return Models;
};
