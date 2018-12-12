'use strict';

const { logger } = require('../services/logger');
const { User } = require('../models');

async function find(ctx, next) {
  await next();
  const [list, count] = await Promise.all([User.find(), User.countDocuments()]);
  ctx.status = 200;
  ctx.body = { list, count };
}

async function findOne(ctx, next) {
  await next();
  logger.info(`${ctx.path}`);
}

async function update(ctx, next) {
  await next();
  logger.info(`${ctx.path}`);
}

async function del(ctx, next) {
  await next();
  logger.info(`${ctx.path}`);
}


module.exports = {
  find,
  findOne,
  update,
  del
};
