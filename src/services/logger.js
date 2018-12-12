'use strict';

const winston = require('winston');

const logger =  winston.createLogger({
  format: winston.format.cli(),
  transports: [
    new winston.transports.Console()
  ]
});

async function defaultLogger(ctx, next) {
  await next();
  logger.log({
    level: 'info',
    message: `[${new Date().toJSON()}] ${ctx.method} - ${ctx.path}`
  });
}

module.exports = {
  logger,
  defaultLogger
};
