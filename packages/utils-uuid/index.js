/**
 * A set of Unique ID generators
 *
 * @module UUID
 *
 * @author Jorge Proaño <jorge@hiddennodeproblem.com>
 */

const Random = require('random-js')
const damnCheckDigit = require('./lib/damn')

const numericSeed = Random.engines.mt19937().autoSeed()

const english = require('./lib/english.json')
const nouns = require('./lib/nouns.json')
const adjetives = require('./lib/adjetives.json')
const pokemons = require('./lib/pokemon.json')

// ────────────────────────────────  Exports  ──────────────────────────────────

/**
 * Creates a 'UUID4 Random String'
 * @return {String}
 */
exports.v4 = () => Random.uuid4(numericSeed)

/**
 * Produce a random string comprised of numbers or the characters ABCDEF of
 * length 'length'
 * @param  {Number} length Length of the Hex String
 * @return {String}        Hex String
 */
exports.hex = (length = 6) => Random.hex()(numericSeed, length)

/**
 * Creates a 'Numeric Random String' with the last digit being used as a
 * CheckDigit using the Damn algorithm.
 * @param  {Number} digits  Requested amount of digits
 * @return {String}         Numeric Random String
 */
exports.numeric = function generateNumeric (digits = 10) {
  const totalDigits = digits - 1
  const max = maxNumber(totalDigits)
  const num = Random.integer(0, max)(numericSeed)
  const base = String(num)
  const padded = base.padStart(totalDigits, '0')
  const hashed = damnCheckDigit.generate(padded)
  return padded + hashed
}

/**
 * Creates a Medical Record Identifier
 * @return {String}
 */
exports.mrn = () => exports.numeric(8)

/**
 * Creates a SMS Validation Token
 * @return {String}
 */
exports.sms = () => exports.numeric(6)

/**
 * Returns the number of milliseconds since the Unix Epoch. Appatently is called
 * ["TimeValue"](https://www.ecma-international.org/ecma-262/6.0/#sec-time-values-and-time-range)
 * @return {String}
 */
exports.timeStamp = () => String(Date.now())

/**
 * Outputs a Unix Timestamp (the number of seconds since the Unix Epoch).
 * @return {String}
 */
exports.shortStamp = () => String(Math.floor(Date.now() / 1000))

/**
 * Outputs a Random Pokemon Name, ONLY FROM THE ORIGINAL 151
 * @param  {Boolean} [hex=true]  Append a random Hex for extra randomess
 * @return {String}             Pokemon Name
 */
exports.pokemon = function pokemon (hex = true) {
  const poke = Random.pick(numericSeed, pokemons)
  if (!hex) return poke
  return `${poke}-${exports.hex()}`
}

/**
 * Generate Heroku-like random names
 * @return {String}
 */
exports.heroku = function heroku () {
  const parts = [
    Random.pick(numericSeed, adjetives),
    Random.pick(numericSeed, nouns)
  ]
  return `${parts.join('-')}-${exports.hex()}`
}

/**
 * Generates a Humanized String delimited by '.'
 * @param  {Number} nouns How many nouns.
 * @return {String}       Humanized String
 */
exports.humanized = function humanized (nouns = 6) {
  return Random.sample(numericSeed, english, nouns).join('.')
}

// ─────────────────────────────────  Utils  ───────────────────────────────────

/* Public utils */
exports.utils = {
  verifyNumeric: damnCheckDigit.verify
}

// ────────────────────────────────  Private  ──────────────────────────────────

/**
 * Finds the maximum possible number for the amount of digits provided.
 * @example // returns 999 maxNumber(3)
 * @param  {Number} digits How many digits will the number have
 * @return {Number}
 * @private
 */
function maxNumber (digits) {
  /** @type {Number} Holds the returned value */
  let max = 0
  // The base number requires one less digit as 0 is a digit already.
  let base = digits - 1
  // Loop through the digits and get the MAX
  for (base; base >= 0; base--) max = max + 9 * Math.pow(10, base)
  return max
}
