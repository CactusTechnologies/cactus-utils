const fp = require('lodash/fp')
const moment = require('moment')
const validator = require('validator')

/**
 * Normalize common data.
 * @namespace {Object} normalize
 * @memberOf module:@cactus-technologies/utils
 */

/**
 * Normalizes the given date to the begining of the date. (This doesn't
 *   validate that the input)
 *
 * @param {(String|Date)} input
 *
 * @return {String} ISO8601 date.
 *
 * @memberOf module:@cactus-technologies/utils.normalize
 * @alias module:@cactus-technologies/utils.normalize.day
 */
exports.day = input =>
  moment
    .utc(input)
    .startOf('day')
    .format()

/**
 * Normalizes an email address. (This doesn't validate that the input is an
 *   email, if you want to validate the email use utils.validate.isEmail
 *   beforehand)
 *
 * @param  {String} input
 *
 * @return {String}
 *
 * @memberOf module:@cactus-technologies/utils.normalize
 * @alias module:@cactus-technologies/utils.normalize.email
 */
exports.email = input => validator.normalizeEmail(input)

/**
 * Normalizes an StatusCode.
 *
 * @param  {Number} status
 *
 * @return {Number}
 *
 * @memberOf module:@cactus-technologies/utils.normalize
 * @alias module:@cactus-technologies/utils.normalize.statusCode
 */
exports.statusCode = status => {
  const { STATUS_CODES } = require('http')
  return fp.has(status, STATUS_CODES) ? status : 500
}

/**
 * Trims an String.
 *
 * @param  {String} input
 *
 * @return {String}
 *
 * @memberOf module:@cactus-technologies/utils.normalize
 * @alias module:@cactus-technologies/utils.normalize.string
 */
exports.string = input => fp.trim(input)

/**
 * Transforms the string in to a Header Style one
 *
 * @param  {String} input
 *
 * @return {String}
 *
 * @memberOf module:@cactus-technologies/utils.normalize
 * @alias module:@cactus-technologies/utils.normalize.header
 */
exports.header = input => fp.pipe([fp.camelCase, fp.capitalize])(input)
