/**
 * Implementation of the Damm algorithm, a check digit algorithm created by H.
 * Michael Damm. It detects all single-digit errors and adjacent transposition
 * errors (swapping adjacent numbers)
 * @module uuid/damn
 */

/**
 * @type {Array}
 * @private
 * @constant
 */
const table = require('./damn-table.json')

/**
 * Generates a Check digit from the input
 * @param  {String} input Must only have digits
 * @return {String}       Check Digit
 */
exports.generate = function generateCheckDigit (input) {
  let row = 0
  for (let i = 0; i < input.length; i++) row = table[row][input.charAt(i)]
  return row.toString()
}

/**
 * Verifies the Numeric String
 * @param  {String} input Value to verify
 * @return {Boolean}
 */
exports.verify = function verifyCheckDigit (input) {
  return exports.generate(input) === '0'
}
