#!/usr/bin/env node

const Listr = require('listr')
const { shell } = require('execa')

const tasks = [
  {
    title: 'Outdated Root packages',
    task: () => shell('npm outdated --long')
  },
  {
    title: 'Outdated Modules packages',
    task: () => shell('lerna exec --no-bail "npm outdated --long"')
  }
]

function main () {
  return new Listr(tasks).run()
}

main()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))
