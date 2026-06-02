const bcrypt = require('bcrypt');

/**
 * Hashes a plain text password using bcrypt.
 * @param {string} password Plain text password.
 * @param {number} rounds Bcrypt rounds.
 * @returns {Promise<string>} Password hash.
 */
async function hashPassword(password, rounds) {
  return bcrypt.hash(password, rounds);
}

/**
 * Compares a plain text password against a bcrypt hash.
 * @param {string} password Plain text password.
 * @param {string} hash Stored hash.
 * @returns {Promise<boolean>} Comparison result.
 */
async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

module.exports = {
  hashPassword,
  comparePassword,
};