/**
 * Config Variables for the app
 */
module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'oh so secret',
  DB_URL: process.env.DB_URL || 'mongodb://localhost:27017/KostaDB',
};