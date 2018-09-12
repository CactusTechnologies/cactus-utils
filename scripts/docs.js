#!/usr/bin/env node

const Listr = require('listr')
const { shell } = require('execa')

const tasks = [
  {
    title: 'Fetching AUTHORS',
    task: () => shell('git log --format="%aN <%aE>" | sort -f | uniq > AUTHORS')
  },
  // {
  //   title: 'Compiling Docs',
  //   task: () => shell('projectz compile')
  // },
  // {
  //   title: 'Add TODOs to the README',
  //   task: () => shell('npm run todos -- --append')
  // },
  {
    title: 'Running modules Documentation',
    task: () => shell('lerna run docs')
  },
  // {
  //   title: 'Compiling modules Docs',
  //   task: () => shell('lerna exec --no-bail projectz -- "compile"')
  // },
  {
    title: 'Adding Docs to git',
    task: () => {
      return new Listr([
        {
          title: 'Root docs',
          task: () => shell('git add README.md AUTHORS LICENSE package.json')
        },
        {
          title: 'Modules Docs',
          task: () =>
            shell(
              'lerna exec --no-bail --concurrency=1 git -- "add README.md package.json LICENSE"'
            )
        }
      ])
    }
  }
]

function main () {
  return new Listr(tasks).run()
}

main()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))
