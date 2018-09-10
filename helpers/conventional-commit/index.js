/**
 * long description for the file
 *
 * @summary A commitizen adapter
 * @author Jorge Proaño
 *
 * Created at     : 2018-08-28 17:17:02
 *
 * Heavily inspired by:
 *  - https://github.com/commitizen/cz-conventional-changelog
 *  - https://github.com/commitizen/cz-cli
 *  - https://github.com/leonardoanalista/cz-customizable
 *  - https://github.com/ngryman/cz-emoji
 */

'use strict'

const readPkg = require('read-pkg-up')
const wrap = require('wrap-ansi')
const truncate = require('cli-truncate')
const termSize = require('term-size')
const fp = require('lodash/fp')
const Fuse = require('fuse.js')
const autocomplete = require('inquirer-autocomplete-prompt')
const chalk = require('chalk')
const types = require('./lib/types.json')

const LIMIT = 100
const MAX = fp.pipe(
  () => termSize(),
  fp.getOr(LIMIT, 'columns'),
  v => (v > LIMIT ? LIMIT : v)
)()
const MAX_DESC = types.reduce(lengthReducer, 0)

/**
 * Export an object containing a `prompter` method. This object is used by `commitizen`.
 *
 * @type {Object}
 */
module.exports = {
  prompter: function (cz, commit) {
    cz.prompt.registerPrompt('autocomplete', autocomplete)
    loadScopes()
      .then(createQuestions)
      .then(cz.prompt)
      .then(cancel)
      .then(format)
      .then(printCommit)
      .then(commit)
      .catch(() => console.error('😔  Commit has been canceled.'))
  }
}

/**
 * Loads the Custom Scopes
 *
 * @returns {Array} Project Scopes.
 */
function loadScopes () {
  return readPkg()
    .then(fp.getOr([], 'pkg.config.scopes'))
    .catch(() => [])
}

/**
 * Parses the types to create a pretty choice
 */
function getChoices () {
  const name = choice => fp.padStart(MAX_DESC)(choice.value)
  const desc = choice => wrap(choice.description, MAX)
  return types.map(choice => ({
    name: `${name(choice)}  ${choice.emoji}  ${desc(choice)}`,
    value: choice.value,
    alt: [...choice.alt, ...choice.scopes]
  }))
}

/**
 * Create inquier.js questions object trying to read `types` and `scopes` from the current project
 * `package.json` falling back to nice default :)
 *
 * @param {Object} scopes Result of the `loadScopes` returned promise
 * @return {Array} Return an array of `inquier.js` questions
 * @private
 */
function createQuestions (scopes) {
  const choices = getChoices()

  const fuzzy = new Fuse(choices, {
    shouldSort: true,
    threshold: 0.4,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: ['value', 'alt']
  })

  return [
    {
      type: 'autocomplete',
      name: 'type',
      message: "Select the type of change you're committing:",
      pageSize: 10,
      source: (answers, query) => {
        return Promise.resolve(query ? fuzzy.search(query) : choices)
      }
    },
    {
      type: 'list',
      name: 'scope',
      message: 'Specify a scope:',
      choices: answers => {
        if (answers.type === 'chore') {
          return [
            { name: ['none'], value: '' },
            'dependencies',
            'scripts',
            'deploy',
            'config',
            'env',
            ...scopes
          ]
        }
        return scopes
      },
      when: answers => answers.type === 'chore' || scopes.length > 0
    },
    {
      type: 'input',
      name: 'subject',
      message: 'Write a short description:',
      default: ({ type, scope }) => {
        if (type === 'WIP') return 'Quick Commit'
        if (type === 'chore' && scope === 'dependencies') {
          return 'Updated dependencies'
        }
        if (type === 'chore' && scope === 'deploy') {
          return 'Updated Deployments'
        }
        if (type === 'chore' && scope === 'config') {
          return 'Updated Configuration files.'
        }
        if (type === 'chore' && scope === 'env') {
          return 'Updated .env'
        }
        if (type === 'chore' && scope === 'scripts') {
          return 'Updated Package scripts.'
        }
        if (type === 'refactor') {
          return 'Passing eslint rules.'
        }
        if (type === 'init') {
          return 'Initial commit.'
        }
        return ''
      },
      validate: input => (input.length > 0 ? true : 'Empty commit!')
    },
    {
      type: 'input',
      name: 'body',
      message: 'Provide a longer description: (optional)',
      when: answers => answers.type !== 'WIP'
    },
    {
      type: 'input',
      name: 'issues',

      message: 'List any issue closed [ex: #1, ...]: (optional)',
      when: answers => answers.type !== 'WIP'
    },
    {
      type: 'input',
      name: 'breaking',
      message: 'List any BREAKING CHANGES (optional):',
      when: answers => ['feat', 'fix'].includes(answers.type)
    },
    {
      type: 'confirm',
      name: 'confirmCommit',
      message: 'Ready to commit?',
      default: true,
      when: answers => answers.type !== 'WIP'
    }
  ]
}

/**
 * Cancels the commit
 *
 * @param {Object} answers Answers provided by `inquier.js`
 * @return {Object} PassTrough
 * @throws {Error} If answers.confirmCommit is false
 */
function cancel (answers) {
  if (answers.confirmCommit === false) {
    throw new Error('User canceled the commit.')
  }
  return answers
}

/**
 * Format the git commit message from given answers.
 *
 * @param {Object} answers Answers provided by `inquier.js`
 * @return {String} Formated git commit message
 */
function format (answers) {
  const { type, subject } = answers
  // parentheses are only needed when a scope is present
  const scope = answers.scope ? `(${answers.scope.trim()}): ` : ': '
  // build head line and limit it to 100
  const head = truncate(`${type}${scope}${subject.trim()}`, LIMIT)
  // wrap body at 100
  const body = answers.body
    ? wrap(answers.body, LIMIT)
      .split('|')
      .join('\n')
    : false

  const breaking = answers.breaking
    ? fp.pipe(
      brk => wrap(brk, LIMIT),
      brk => `BREAKING CHANGE:
      ${brk}`
    )(answers.breaking)
    : false
  // Close issues
  const footer = answers.issues
    ? (answers.issues.match(/#\d+/g) || [])
      .map(issue => `Fixes ${issue}`)
      .join('\n')
    : false

  return fp
    .compact([head, body, breaking, footer])
    .join('\n\n')
    .trim()
}

function printCommit (msg) {
  console.log(`${chalk.green('> Commit message:')}

  ${chalk.dim(msg)}

  `)
  return msg
}

function lengthReducer (max, { value }) {
  return value.length > max ? value.length : max
}
