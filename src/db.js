const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('sqlite://./db.sqlite3');

const Models = require('./models')(sequelize);

Object.keys(Models).forEach(async (model) => {
  Models[model].sync({ force: process.env.DB_ACTION === 'force' });
});
