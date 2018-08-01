const fp = require('lodash/fp')
const moment = require('moment')
const validator = require('validator')

/**
 * Assert functions for quick validations.
 * @namespace {Object} assert
 * @memberOf module:@cactus-technologies/utils
 */

/**
 * Returns `true` if the value is undefined' or 'null'
 *
 * @param {*} entry - Value to Check
 *
 * @return {Boolean}
 *
 * @category Validation
 * @memberOf assert
 * @alias module:@cactus-technologies/utils.assert.isNil
 */

exports.isNil = entry => fp.isNil(entry)

/**
 * Returns `true` if the value is 'empty'
 *
 * @param {*} entry - Value to Check
 *
 * @return {Boolean}
 *
 * @category Validation
 * @memberOf assert
 * @alias module:@cactus-technologies/utils.assert.isEmpty
 */

exports.isEmpty = entry => fp.anyPass([fp.isNil, fp.isEmpty])(entry)

/**
 * Returns `true` if the value is a number or can be casted as one. `Infinite`
 *   and `NaN` are consider `false`
 *
 * @param {*} entry - Value to Check
 *
 * @return {Boolean}
 *
 * @category Validation
 * @memberOf module:@cactus-technologies/utils.isNumber
 * @alias module:@cactus-technologies/utils.assert.isNumber
 */

exports.isNumber = entry =>
  fp.pipe(
    String,
    fp.parseInt,
    fp.isFinite
  )(entry)

/**
 * Returns `true` if the value is a String
 *
 * @param {*} entry - Value to Check
 *
 * @return {Boolean}
 *
 * @category Validation
 * @memberOf assert
 * @alias module:@cactus-technologies/utils.assert.isString
 */

exports.isString = entry => fp.allPass([exports.notEmpty, fp.isString])(entry)

/**
 * Returns `true` if the value is a valid phone Email address
 *
 * @param {String} entry - Value to Check
 *
 * @return {Boolean}
 *
 * @category Validation
 * @memberOf assert
 * @alias module:@cactus-technologies/utils.assert.isEmail
 */

exports.isEmail = entry =>
  fp.allPass([exports.isString, validator.isEmail])(entry)

/**
 * Returns `true` if the value is a valid CreditCard
 *
 * @param {*} entry - Value to Check
 *
 * @return {Boolean}
 *
 * @category Validation
 * @memberOf assert
 * @alias module:@cactus-technologies/utils.assert.isCreditCard
 */

exports.isCreditCard = entry =>
  fp.allPass([exports.isString, validator.isCreditCard])(entry)

/**
 * Returns `true` if the value is a function
 *
 * @param {*} entry - Value to Check
 *
 * @return {Boolean}
 *
 * @category Validation
 * @memberOf assert
 * @alias module:@cactus-technologies/utils.assert.isFunction
 */

exports.isFunction = entry => fp.isFunction(entry)

/**
 * Returns `true` if if value is a plain object, that is, an `object` created
 *   by the `Object constructor` or one with a `[[Prototype]]` of `null`.
 *
 * @param {*} entry - Value to Check
 *
 * @return {Boolean}
 *
 * @category Validation
 * @memberOf assert
 * @alias module:@cactus-technologies/utils.assert.isObject
 */

exports.isObject = entry => fp.isPlainObject(entry)

/**
 * Returns `true` if if value is an `Array`
 *
 * @param {*} entry - Value to Check
 *
 * @return {Boolean}
 *
 * @category Validation
 * @memberOf assert
 * @alias module:@cactus-technologies/utils.assert.isArray
 */
exports.isArray = entry => fp.isArray(entry)

/**
 * Returns `true` if the value is a valid Date
 *
 * @param {*} entry - Value to Check
 *
 * @return {Boolean}
 *
 * @category Validation
 * @memberOf assert
 * @alias module:@cactus-technologies/utils.assert.isValidDate
 */

exports.isValidDate = entry =>
  fp.allPass([exports.notNil, v => moment(v).isValid()])(entry)

/**
 * Returns `true` if the value is a valid Date
 *
 * @param {*} entry - Value to Check
 *
 * @return {Boolean}
 *
 * @category Validation
 * @deprecated since version 1.0.4
 * @memberOf assert
 * @alias module:@cactus-technologies/utils.assert.isDate
 */

exports.isDate = require('util').deprecate(
  exports.isValidDate,
  'Renamed to utils.assert.isValidDate'
)

/**
 * Returns `true` if the value is a valid Date and the date is before today.
 *   (day precision)
 *
 * @param {*} entry - Value to Check
 *
 * @return {Boolean}
 *
 * @category Date Validation
 * @memberOf assert
 * @alias module:@cactus-technologies/utils.assert.isBeforeToday
 */

exports.isBeforeToday = entry =>
  fp.allPass([
    exports.notNil,
    v => moment(v).isValid(),
    v => moment.utc(v).isBefore(moment.utc(), 'day')
  ])(entry)

/**
 * Returns `true` if the value is a valid Date and the date is before the given
 *   one. (ms presicion)
 *
 * @param {*} entry - Value to Check
 * @param {(String|Date)} [date=Date.now()] Date to test against
 *
 * @return {Boolean}
 *
 * @category Date Validation
 * @memberOf assert
 * @alias module:@cactus-technologies/utils.assert.isBefore
 */

exports.isBefore = (entry, date = Date.now()) =>
  fp.allPass([
    exports.notNil,
    v => moment(v).isValid(),
    v => moment.utc(v).isBefore(moment.utc(date), 'day')
  ])(entry)

/**
 * Returns `true` if the value is a valid Date and the date is after the given
 *   one. (ms presicion)
 *
 * @param {*} entry - Value to Check
 * @param {(String|Date)} [date=Date.now()] Date to test against
 *
 * @return {Boolean}
 *
 * @category Date Validation
 * @memberOf assert
 * @alias module:@cactus-technologies/utils.assert.isAfter
 */

exports.isAfter = (entry, date = Date.now()) =>
  fp.allPass([
    exports.notNil,
    v => moment(v).isValid(),
    v => moment.utc(v).isAfter(moment.utc(date), 'day')
  ])(entry)

/**
 * Returns `true` if the value is a valid status code (>= 200 < 400)
 *
 * @param {Number} entry - Value to Check
 *
 * @return {Boolean}
 *
 * @category Validation
 * @memberOf assert
 * @alias module:@cactus-technologies/utils.assert.isOkStatus
 */

exports.isOkStatus = entry => entry >= 200 && entry < 400

/**
 * Returns A function that will return `true` if the given entry exist ins the given array
 *
 * @param {Array} values - Array to Check
 *
 * @return {Function}
 *
 * @category Validation
 * @memberOf assert
 * @alias module:@cactus-technologies/utils.assert.isIn
 */

exports.isIn = values => entry => values.includes(entry)

/**
 * Returns A function that will return `true` if the given entry exist ins the given array
 *
 * @param {Array} values - Array to Check
 *
 * @return {Function}
 *
 * @category Validation
 * @deprecated since version 1.0.4
 * @memberOf assert
 * @alias module:@cactus-technologies/utils.assert.inEnumeration
 */

exports.inEnumeration = require('util').deprecate(
  exports.isIn,
  'Renamed to utils.assert.isIn'
)

/**
 * Returns `true` if the value is not 'undefined' or 'null'
 *
 * @param {*} entry - Value to Check
 *
 * @return {Boolean}
 *
 * @category Negated Validation
 * @memberOf assert
 * @alias module:@cactus-technologies/utils.assert.notNil
 */

exports.notNil = entry => fp.negate(fp.isNil)(entry)

/**
 * Returns `true` if the value is not empty
 *
 * @param {*} entry - Value to Check
 *
 * @return {Boolean}
 *
 * @category Negated Validation
 * @memberOf assert
 * @alias module:@cactus-technologies/utils.assert.notEmpty
 */

exports.notEmpty = entry => fp.negate(exports.isEmpty)

/**
 * Returns `true` if the value is not a valid Date
 *
 * @param {*} entry - Value to Check
 *
 * @return {Boolean}
 *
 * @category Negated Validation
 * @memberOf assert
 * @alias module:@cactus-technologies/utils.assert.notValidDate
 */
exports.notValidDate = entry => fp.negate(exports.isValidDate)

/**
 * Returns `true` if the value is not a valid Date
 *
 * @param {*} entry - Value to Check
 *
 * @return {Boolean}
 *
 * @category Negated Validation
 * @deprecated since version 1.0.4
 * @memberOf assert
 * @alias module:@cactus-technologies/utils.assert.notDate
 */
exports.notDate = require('util').deprecate(
  exports.isIn,
  'Renamed to utils.assert.notValidDate'
)

/**
 * Returns `true` if the value is not a valid status code (>= 200 < 400)
 *
 * @param {*} entry - Value to Check
 *
 * @return {Boolean}
 *
 * @category Negated Validation
 * @memberOf assert
 * @alias module:@cactus-technologies/utils.assert.notOkStatus
 */

exports.notOkStatus = entry => fp.negate(exports.isOkStatus)(entry)

/**
 * Returns `true` if the path exists, false otherwise.
 *
 * @param {String} path - Location to be tested
 *
 * @return {Boolean}
 *
 * @category FileSystem Validation
 * @memberOf assert
 * @alias module:@cactus-technologies/utils.assert.exists
 */
exports.exists = path => require('fs').existsSync(path)
