'use strict';

const Koa = require('koa');
const app = new Koa();

const helmet = require("koa-helmet");
const jwt = require('koa-jwt');
const bodyParser = require('koa-bodyparser');

const { Db } = require('./src/services/database');

const { JWT_SECRET } = require('./src/config');
const { router } = require('./src/routes');
const { defaultLogger, logger } = require('./src/services/logger');

app.context.Db = Db;

app
  .use(helmet())
  .use(bodyParser())
  .use(defaultLogger)
  .use(jwt({ secret: JWT_SECRET }).unless({ path: [/^\/auth/, /^\/public/] }))
  .use(router.routes())
  .use(router.allowedMethods());


app.on('error', (err, ctx) => {
  logger.error(err);
  if (ctx) {
    ctx.body = { error: 'The sever went Kaput', status: 500 };
  }
});

app.listen(5000);