/*!
 * Copyright 2019 Cactus Technologies, LLC. All rights reserved.
 */

import { createEntropy, MersenneTwister19937, Random } from 'random-js'
import adjectives from './dictionaries/adjectives.json'
import damnTable from './dictionaries/damn-table.json'
import english from './dictionaries/english.json'
import nouns from './dictionaries/nouns.json'
import pokemons from './dictionaries/pokemon.json'

// ────────────────────────────────  ENGINE  ───────────────────────────────────

/*
 * Random Engine: https://en.wikipedia.org/wiki/Mersenne_Twister
 * This is the random engine that powers the entire UUID module.
 */
const seed = process.env.NODE_ENV === 'test' ? [12345] : createEntropy() // tslint:disable-line: no-magic-numbers
const ENGINE = MersenneTwister19937.seedWithArray(seed)

// ─────────────────────────────────  Random  ──────────────────────────────────
export const random = new Random(ENGINE)

// ────────────────────────────────  Methods  ──────────────────────────────────

/**
 * Creates a 'UUID4 Random String'
 */
export const v4 = (): string => random.uuid4()

/**
 * Produce a random string comprised of numbers or the characters ABCDEF of
 * length 'length'
 */
export const hex = (length = 6): string => random.hex(length)
/**
 * Creates a 'Numeric Random String' with the last digit being used as a
 * CheckDigit using the Damn algorithm.
 */
export function numeric(digits = 10) {
  const totalDigits = digits - 1
  const max = maxNumber(totalDigits)
  const num = random.integer(0, max)
  const base = String(num)
  const padded = base.padStart(totalDigits, '0')
  const hashed = generateCheckDigit(padded)

  return padded + hashed
}

/**
 * Returns the number of milliseconds since the Unix Epoch. Apparently is called
 * [TimeValue](https://www.ecma-international.org/ecma-262/6.0/#sec-time-values-and-time-range)
 */
export const timeStamp = () => String(Date.now())

/**
 * Outputs a Unix Timestamp (the number of seconds since the Unix Epoch).
 */

export const shortStamp = () => String(Math.floor(Date.now() / 1000)) // tslint:disable-line: no-magic-numbers

/**
 * Outputs a Random Pokemon Name, ONLY FROM THE ORIGINAL 151
 */
export function pokemon(addHex = true) {
  const poke = random.pick(pokemons)
  if (!addHex) return poke

  return `${poke}-${hex()}`
}

/**
 * Generate Heroku-like random names
 */
export function heroku(addHex = true) {
  const parts = [random.pick(adjectives), random.pick(nouns)]
  if (addHex) parts.push(hex())

  return parts.join('-')
}

/**
 * Generates a Humanized String delimited by '.'
 */
export function humanized(words = 6) {
  return random.sample(english, words).join('.')
}

// ────────────────────────────────  Private  ──────────────────────────────────

/**
 * Finds the maximum possible number for the amount of digits provided.
 * @private
 */
function maxNumber(digits: number) {
  let max = 0
  // The base number requires one less digit as 0 is a digit already.
  let base = digits - 1
  // Loop through the digits and get the MAX
  // tslint:disable-next-line: no-magic-numbers
  for (base; base >= 0; base--) max = max + 9 * Math.pow(10, base)

  return max
}

/**
 * Implementation of the Damm algorithm, a check digit algorithm created by H.
 *   Michael Damm. It detects all single-digit errors and adjacent
 *   transposition errors (swapping adjacent numbers)
 *
 * @private
 */
function generateCheckDigit(input: string) {
  let row = 0
  // tslint:disable-next-line: no-unsafe-any
  for (let i = 0; i < input.length; i++) row = damnTable[row][input.charAt(i)]

  return row.toString()
}
