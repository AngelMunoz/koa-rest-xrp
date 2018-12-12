'use strict';

const Koa = require('koa');
const app = new Koa();
const { connect } = require('./src/services/database')
const helmet = require("koa-helmet");
const jwt = require('koa-jwt');
const bodyParser = require('koa-bodyparser');

const { JWT_SECRET, HOST, PORT } = require('./src/config');
const { router } = require('./src/routes');
const { defaultLogger, logger } = require('./src/services/logger');

app
  .use(helmet())
  .use(bodyParser())
  .use(jwt({ secret: JWT_SECRET }).unless({ path: [/^\/auth/, /^\/public/] }))
  .use(router.routes())
  .use(router.allowedMethods())
  .use(defaultLogger)
  .on('error', (err, ctx) => {
    if (ctx) {
      logger.error(`[${err}] - ${ctx.href}`);
    } else {
      logger.error(`[${err}]`);
    }
  })

async function main() {
  await connect();
  app.listen(PORT, HOST)
  logger.info(`Server Ready at [${HOST}:${PORT}] - ${new Date().toUTCString()}`);
}

process
  .on('unhandledRejection', (reason, promise) => {
    promise.catch(err => {
      logger.error(`Unhandled Promise: [${reason}]: ${err.stack}`);
    });
  });



main();