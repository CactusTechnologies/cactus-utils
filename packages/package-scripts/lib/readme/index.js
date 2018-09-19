'use strict'

const fp = require('lodash/fp')

const { promisify } = require('util')
const unified = require('unified')
const parse = require('remark-parse')
const stringify = require('remark-stringify')
const flattenImg = require('mdast-flatten-image-paragraphs')
const license = require('remark-license')
const toc = require('remark-toc')
const github = require('remark-github')

const { README_PATH, README_TP_PATH } = require('../constants')
const utils = require('../utils')

const title = require('./title')
const install = require('./install')
const contrib = require('./contributors')
const changelog = require('./changelog')
const todos = require('./todos')
const normalize = require('./normalize')
const usage = require('./usage')

const isGitHub = fp.pipe(
  fp.get('source'),
  fp.equals('github.com')
)

const getRepository = repo => (isGitHub(repo) ? repo.toString('https') : '')

module.exports = ({ pkg, repoData, contributors }) => {
  const readme = unified()

  readme.use(parse)
  readme.use(stringify, {
    gfm: true,
    rule: '-',
    ruleSpaces: false
  })
  readme.use(flattenImg)
  readme.use(title, { pkg })
  readme.use(install, { pkg, repoData })
  readme.use(usage)
  readme.use(contrib, { contributors })
  readme.use(changelog)
  readme.use(todos, { ignore: [] })
  readme.use(license)
  readme.use(toc)
  readme.use(normalize)

  if (isGitHub(repoData)) {
    readme.use(github, { repository: getRepository(repoData) })
  }

  const compile = promisify(readme.process.bind(readme))

  return utils
    .readFile(README_PATH, false)
    .catch(() => utils.readFile(README_TP_PATH))
    .then(readme => compile(readme))
    .then(data => utils.writeFile(README_PATH, data))
    .catch(onError)
}

function onError (err) {
  throw err
}
