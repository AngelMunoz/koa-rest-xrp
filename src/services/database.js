'use strict';

const mongoose = require('mongoose');
const { DB_URL } = require('../config');

async function connect() {
  try {
    await mongoose.connect(DB_URL, { useNewUrlParser: true });
  } catch (error) {
    process.stderr.write(`Database Connection could not be stablished ${error}\n`);
    process.exit(1);
  }
}

module.exports = {
  connect
};
