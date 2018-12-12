'use strict';

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

/**
 * JsonWebToken Service to issue, decode and verify tokens
 * @class
 */
class JwtService {

  /**
   * works on top of the token if provided
   * @param {object?} token  Json Web Token provided to work with it
   */
  constructor(token = JWT_SECRET) {
    this.token = token;
  }

  /**
   * decodes a json web token
   * @param {string} token jwt to be decoded
   */
  decodeJwt(token = this.token) {
    let payload = {};
    try {
      payload = jwt.decode(token);
    } catch (error) {
      throw new Error(error.message);
    }
    return payload;
  }

  /**
   * issues a json web token
   * @param {{ [x: string]: any }} payload Any Key/Value that you want to add to the token in question
   * @param {{ [x: string]: any }} options SignOptions from the jsonwebtoken lib
   */
  async issueToken(payload = {}, options = { expiresIn: '1 day' }) {
    const token = await jwt.sign(payload, this.token, options);
    // All done.
    return token;
  }

  /**
   *
   * @param {string} token token to be verified
   * @param {{ [x: string]: any }} options VeryfyOptions from the jsonwebtoken lib
   * @return {boolean}
   */
  verify(token = this.token, options = {}) {
    let valid = false;
    try {
      valid = !!jwt.verify(token, this.token, options);
    } catch (error) {
      throw new Error(error.message);
    }
    // All done.
    return valid;
  }
}

module.exports = {
  JwtService
};
