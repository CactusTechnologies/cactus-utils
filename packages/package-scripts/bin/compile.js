const Listr = require('listr')
const {
  IN_REPO,
  README_PATH,
  GITHUB_ACCESS_TOKEN
} = require('../lib/constants')
const utils = require('../lib/utils')
const chalk = require('chalk')

exports.command = 'compile'
exports.describe = 'Updates the project files'
exports.aliases = []
exports.builder = argv =>
  argv
    .option('f', {
      alias: ['override', 'force'],
      default: false,
      describe: 'Overrides the README.md file',
      type: 'boolean'
    })
    .option('todos', {
      alias: ['todo'],
      default: true,
      describe: 'Saves a TODO.md file',
      type: 'boolean'
    })

exports.handler = main

// ─────────────────────────────────  MAIN  ────────────────────────────────────

const tasks = new Listr(
  [
    {
      title: 'Git metadata',
      enabled: () => IN_REPO,
      task: require('../lib/tasks/git-data')
    },
    {
      title: 'Hash current state',
      task: require('../lib/tasks/hash')
    },
    {
      title: 'Update package.json',
      task: require('../lib/tasks/package')
    },
    {
      title: 'Override README.md',
      enabled: ctx => ctx.override || utils.exists(README_PATH) === false,
      task: require('../lib/tasks/readme-override')
    },
    {
      title: 'Update README.md',
      task: require('../lib/tasks/readme')
    },
    {
      title: 'Update LICENSE',
      task: require('../lib/tasks/license')
    },
    {
      title: 'Update AUTHORS',
      enabled: () => IN_REPO,
      task: require('../lib/tasks/authors')
    },
    {
      title: 'Update TODOs',
      skip: ctx => ctx.todos === false,
      task: require('../lib/tasks/todos')
    },
    {
      title: 'Prettify generated',
      task: require('../lib/tasks/prettier')
    },
    {
      title: 'Add Generated to GIT',
      enabled: () => IN_REPO,
      task: require('../lib/tasks/git-add')
    }
  ],
  { exitOnError: false, dateFormat: false }
)

function main (argv) {
  if (IN_REPO && !GITHUB_ACCESS_TOKEN) {
    console.log(chalk`
  {yellow This tool works better if you have a {bold GITHUB_ACCESS_TOKEN} variable in your enviroment.}
  Navigate to: {cyan https://github.com/settings/tokens} to generate one.
  Add it to your enviroment: {bold.green echo 'export GITHUB_ACCESS_TOKEN={red.cyan YOUR_TOKEN}' >> ~/.bashrc}
`)
  }
  return tasks.run({
    hash: {},
    remote: false,
    repoData: {},
    contributors: [],
    pkg: {},
    override: argv.override,
    todos: argv.todos
  })
}
