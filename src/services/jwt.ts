import { decode, sign, verify, SignOptions } from "jsonwebtoken";
import { JWT_SECRET } from "../config";

/**
 * JsonWebToken Service to issue, decode and verify tokens
 * @class
 */
export class JwtService {
  /**
   * works on top of the token if provided
   * @param {string?} token  Json Web Token provided to work with it
   */
  constructor(private readonly token: string | null = JWT_SECRET) {}

  /**
   * decodes a json web token
   * @param {string} token jwt to be decoded
   */
  decodeJwt(token = this.token) {
    try {
      let payload = decode(token);
      if (payload) {
        return payload;
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  /**
   * issues a json web token
   * @param {Record<string, string>} payload Any Key/Value that you want to add to the token in question
   * @param {SignOptions} options SignOptions from the jsonwebtoken lib
   */
  issueToken(payload = {}, options = { expiresIn: "1 day" }) {
    const token = sign(payload, this.token, options);
    // All done.
    return token;
  }

  /**
   *
   * @param {Record<string, any>} options VeryfyOptions from the jsonwebtoken lib
   * @param {string} token token to be verified
   * @return {boolean}
   */
  verify(
    options: Record<string, any> = {},
    token: string = this.token
  ): boolean {
    try {
      var valid = !!verify(token, this.token, options);
    } catch (error) {
      throw new Error(error.message);
    }
    // All done.
    return valid;
  }
}
