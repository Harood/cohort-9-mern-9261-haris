const mysql = require('mysql2');
const logger = require('../utils/logger');
require('dotenv').config();

const required = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'DB_PORT'];
const missing = required.filter((key) => !process.env[key]);
if (missing.length > 0) {
  logger.error(`Missing required env vars: ${missing.join(', ')}`);
  process.exit(1);
}

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  waitForConnections: true,
  connectionLimit: 10,
});

const promisePool = pool.promise();

pool.getConnection((err, connection) => {
  if (err) {
    logger.error({ err }, 'Failed to connect to MySQL database');
    process.exit(1); // fail fast instead of letting server run with a dead DB
  } else {
    logger.info('Connected to MySQL database');
    connection.release();
  }
});

module.exports = promisePool;