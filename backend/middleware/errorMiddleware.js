const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  logger.error({ err }, 'Unhandled error');

  const clientMessage = statusCode >= 500 ? 'Internal server error' : err.message;

  res.status(statusCode).json({
    success: false,
    message: clientMessage,
  });
};

module.exports = errorHandler;