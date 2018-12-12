'use strict';

const { JwtService } = require('../services/jwt');
const { hash, compare } = require('bcryptjs');
const { logger } = require('../services/logger');
const { User } = require('../models');

async function login(ctx, next) {
  await next();
  if (!ctx.request.body || !ctx.request.body.email || !ctx.request.body.password) {
    ctx.response.status = 400;
    ctx.body = { error: 'Missing Fields' };
    return;
  }
  const payload = Object.assign({}, ctx.request.body);
  const creds = await User.findOne({ email: payload.email })
    .select('email')
    .select('password')
    .exec();

  const valid = await compare(payload.password, creds.password);

  if (!valid) {
    ctx.response.status = 403;
    ctx.body = { error: 'Invalid Credentials' };
    return;
  }

  const jwts = new JwtService();
  const token = await jwts.issueToken({ user: { id: creds.id, email: creds.email } });
  ctx.body = { token, user: creds.id };
}

async function signup(ctx, next) {
  await next();
  if (!ctx.request.body) {
    ctx.response.status = 400;
    ctx.body = { error: 'Missing Request Body' };
    return;
  }
  const payload = Object.assign({}, ctx.request.body);
  payload.password = await hash(payload.password, 10);
  const user = new User(payload)
  try {
    await user.save();
  } catch (error) {
    logger.warn(`[${__filename}]:[SignUp] - ${error.message}`);
    ctx.response.status = 422;
    if (error.code === 11000) {
      ctx.body = { error: 'That Email is already in use.' };
      return;
    }
    ctx.body = { error: 'Missing Request Body' };
    return;
  }
  ctx.response.status = 202;
}

module.exports = {
  login,
  signup
};
