/**
 * A set of Unique ID generators
 *
 * @module @cactus-technologies/uuid
 * @typicalname uuid
 */

const Random = require('random-js')
const english = require('./lib/english.json')
const nouns = require('./lib/nouns.json')
const adjectives = require('./lib/adjectives.json')
const pokemons = require('./lib/pokemon.json')
const damnTable = require('./lib/damn-table.json')

// ───────────────────────────────  SINGLETON  ─────────────────────────────────

/* Create a single unique symbol for the engine */
const SYMBOL = Symbol.for('@cactus-technologies/random')
/* Check if the symbol exists and add it if not found */
if (!Object.getOwnPropertySymbols(global).includes(SYMBOL)) {
  global[SYMBOL] = Random.engines.mt19937()
  global[SYMBOL].autoSeed()
}

/*
 * Random Engine: https://en.wikipedia.org/wiki/Mersenne_Twister
 * This is the random engine that powers the entire UUID module.
 */
const ENGINE = global[SYMBOL]

// ────────────────────────────────  Methods  ──────────────────────────────────

/**
 * Creates a 'UUID4 Random String'
 * @return {String}
 */
exports.v4 = () => Random.uuid4(ENGINE)

/**
 * Produce a random string comprised of numbers or the characters ABCDEF of
 * length 'length'
 * @param  {Number} length Length of the Hex String
 * @return {String}        Hex String
 */
exports.hex = (length = 6) => Random.hex()(ENGINE, length)

/**
 * Creates a 'Numeric Random String' with the last digit being used as a
 * CheckDigit using the Damn algorithm.
 * @param  {Number} digits  Requested amount of digits
 * @return {String}         Numeric Random String
 */
exports.numeric = function generateNumeric (digits = 10) {
  const totalDigits = digits - 1
  const max = maxNumber(totalDigits)
  const num = Random.integer(0, max)(ENGINE)
  const base = String(num)
  const padded = base.padStart(totalDigits, '0')
  const hashed = generateCheckDigit(padded)
  return padded + hashed
}

/**
 * Returns the number of milliseconds since the Unix Epoch. Apparently is called
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
  const poke = Random.pick(ENGINE, pokemons)
  if (!hex) return poke
  return `${poke}-${exports.hex()}`
}

/**
 * Generate Heroku-like random names
 * @return {String}
 */
exports.heroku = function heroku (hex = true) {
  const parts = [Random.pick(ENGINE, adjectives), Random.pick(ENGINE, nouns)]
  if (hex) parts.push(exports.hex())
  return parts.join('-')
}

/**
 * Generates a Humanized String delimited by '.'
 * @param  {Number} words How many words.
 * @return {String}       Humanized String
 */
exports.humanized = function humanized (words = 6) {
  return Random.sample(ENGINE, english, words).join('.')
}

// ────────────────────────────────  Exports  ──────────────────────────────────

/* Freeze the API */
module.exports = Object.freeze(module.exports)

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

/**
 * Implementation of the Damm algorithm, a check digit algorithm created by H.
 *   Michael Damm. It detects all single-digit errors and adjacent
 *   transposition errors (swapping adjacent numbers)
 *
 * @param {String} input - Must only have digits
 *
 * @return {String}       Check Digit
 * @private
 */
function generateCheckDigit (input) {
  let row = 0
  for (let i = 0; i < input.length; i++) row = damnTable[row][input.charAt(i)]
  return row.toString()
}
