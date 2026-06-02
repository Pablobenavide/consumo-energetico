const jwt = require('jsonwebtoken');

/**
 * Creates a signed JWT for the authenticated user.
 * @param {object} payload Token payload.
 * @param {string} secret Signing secret.
 * @returns {string} Signed JWT.
 */
function signToken(payload, secret) {
  return jwt.sign(payload, secret, { expiresIn: '8h' });
}

/**
 * Verifies a JWT and returns the decoded payload.
 * @param {string} token JWT string.
 * @param {string} secret Signing secret.
 * @returns {object} Decoded payload.
 */
function verifyToken(token, secret) {
  return jwt.verify(token, secret);
}

module.exports = {
  signToken,
  verifyToken,
};