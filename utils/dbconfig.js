const config = require('../config/appconfig');
const { Pool } = require('pg');

const db = new Pool({
  host: config.db.host,
  user: config.db.username,
  password: config.db.password,
  database: config.db.database,
  port: config.db.port,
  dialect: config.db.dialect,
  dialectOptions: {
    useUTC: false, // for reading from database
  }
});

module.exports = {db};