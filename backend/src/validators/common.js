const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates the shape of an email value.
 * @param {string} email Email to validate.
 * @returns {boolean} Whether the email is valid.
 */
function isValidEmail(email) {
  return emailRegex.test(String(email || '').trim());
}

/**
 * Ensures a string contains visible characters.
 * @param {string} value String value.
 * @returns {boolean} Whether the string is valid.
 */
function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

module.exports = {
  isValidEmail,
  isNonEmptyString,
};