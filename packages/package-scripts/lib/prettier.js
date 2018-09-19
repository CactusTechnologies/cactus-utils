'use strict'

const Listr = require('listr')
const execa = require('execa')

const { README_PATH, PKG_PATH } = require('./constants')

module.exports = () =>
  new Listr([
    {
      title: 'Prettier package.json',
      task: () => execa.stdout('prettier', ['--write', PKG_PATH])
    },
    {
      title: 'Prettier README.md',
      task: () => execa.stdout('prettier', ['--write', README_PATH])
    }
  ])
