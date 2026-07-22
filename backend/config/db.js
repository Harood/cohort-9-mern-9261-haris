const mysql = require('mysql2');
const logger = require('../utils/logger');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
});

const promisePool = pool.promise();

// Quick connection check on startup
pool.getConnection((err, connection) => {
  if (err) {
    logger.error({ err }, 'Failed to connect to MySQL database');
  } else {
    logger.info('Connected to MySQL database');
    connection.release();
  }
});

module.exports = promisePool;