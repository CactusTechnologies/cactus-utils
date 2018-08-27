#!/usr/bin/env node

const Listr = require('listr')
const { shell } = require('execa')

const main = new Listr(
  [
    {
      title: 'Linting',
      task: (ctx, task) => shell('eslint --ignore-path .gitignore "**/**"')
    },

    {
      title: 'Running modules tests',
      task: (ctx, task) => {
        return shell('lerna run --no-bail --stream test')
      }
    }
  ],
  { exitOnError: false }
)

main
  .run()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))
