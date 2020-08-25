const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('sqlite://./db.sqlite3', {
  logging: () => {},
});

const Models = require('./models')(sequelize);

let synced = false;

module.exports = async () => {
  if (!synced) {
    Object.keys(Models).forEach(async (model) => {
      await Models[model].sync({ force: true || process.env.DB_ACTION === 'force' });
    });
    synced = true;
  }
  return Models;
};
