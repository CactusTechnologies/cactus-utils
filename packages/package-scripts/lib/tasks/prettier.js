'use strict'

const Listr = require('listr')
const execa = require('execa')

const { README_PATH, PKG_PATH, TODO_PATH } = require('../constants')

module.exports = () =>
  new Listr([
    {
      title: 'Prettier package.json',
      task: () => execa.stdout('prettier', ['--write', PKG_PATH])
    },
    {
      title: 'Prettier README.md',
      task: () => execa.stdout('prettier', ['--write', README_PATH])
    },
    {
      title: 'Prettier TODO.md',
      skip: ctx => ctx.todos === false,
      task: () => execa.stdout('prettier', ['--write', TODO_PATH])
    }
  ])
