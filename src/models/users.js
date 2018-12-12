'use strict';

const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true, select: false },
  name: { type: String, required: true },
  lastName: { type: String, required: true },
}, { timestamps: true });

UserSchema.index({ email: 1 }, { unique: true })

const User = model('User', UserSchema, 'users');
User.createIndexes();

module.exports = {
  User
};
