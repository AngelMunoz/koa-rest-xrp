'use strict';

/**
 * Config Variables for the app
 */
module.exports = {
  HOST: process.env.HOST || '127.0.0.1',
  PORT: process.env.PORT || 5000,
  JWT_SECRET: process.env.JWT_SECRET || 'oh so secret',
  DB_URL: process.env.DB_URL || 'mongodb://localhost:27017/KostaDB',
};
