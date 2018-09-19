const Listr = require('listr')
const { IN_REPO, HAS_PKG, ERR_PKG } = require('./constants')
const utils = require('./utils')

const tasks = new Listr(
  [
    {
      title: 'Preconditions',
      task: require('./hash')
    },
    {
      title: 'Git metadata',
      enabled: () => IN_REPO,
      task: require('./git-data')
    },
    {
      title: 'Update package.json',
      task: require('./package')
    },
    {
      title: 'Update README.md',
      task: require('./readme')
    },
    {
      title: 'Update LICENSE',
      task: require('./license')
    },
    {
      title: 'Update AUTHORS',
      enabled: () => IN_REPO,
      task: require('./authors')
    },
    {
      title: 'Prettify generated',
      task: require('./prettier')
    },
    {
      title: 'Add Generated to GIT',
      enabled: () => IN_REPO,
      task: require('./git-add')
    }
  ],
  { exitOnError: false }
)

module.exports = argv => {
  if (!HAS_PKG) throw new Error(ERR_PKG)

  /* Catch unhandledRejections */
  process.removeAllListeners('unhandledRejection')
  process.prependListener('unhandledRejection', reason => {
    if (argv.debug) console.error(reason) // eslint-disable-line
  })

  tasks
    .run({
      hash: {},
      remote: false,
      repoData: {},
      contributors: [],
      pkg: {}
    })
    // .then(ctx => console.log(ctx))
    .catch(utils.onError)
}
