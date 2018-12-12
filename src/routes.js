'use strict';

const Router = require('koa-router');
const router = new Router();
// import other routes

const auth = require('./actions/auth');
const users = require('./actions/users');


router
  // auth
  .post('/auth/login', auth.login)
  .post('/auth/signup', auth.signup)
  // users
  .get('/api/users', users.find)
  .get('/api/users/:id', users.findOne)
  .patch('/api/users/:id', users.update)
  .del('/api/users/:id', users.del);

module.exports = {
  router
};
