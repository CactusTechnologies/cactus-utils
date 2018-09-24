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

const { README_PATH } = require('../constants')
const utils = require('../utils')

const title = require('../readme/title')
const install = require('../readme/install')
const contrib = require('../readme/contributors')
const changelog = require('../readme/changelog')
const normalize = require('../readme/normalize')
const usage = require('../readme/usage')

const isGitHub = fp.pipe(
  fp.get('source'),
  fp.equals('github.com')
)

const getRepository = repo => (isGitHub(repo) ? repo.toString('https') : '')

module.exports = ({ pkg, repoData, contributors, force }) => {
  const readme = unified()

  readme.use(parse)
  readme.use(stringify)
  readme.use(flattenImg)
  readme.use(title, { pkg })
  readme.use(install, { pkg, repoData })
  readme.use(usage)
  readme.use(contrib, { contributors })
  readme.use(changelog)
  readme.use(license)
  readme.use(toc)
  readme.use(normalize)

  if (isGitHub(repoData)) {
    readme.use(github, { repository: getRepository(repoData) })
  }

  const compile = promisify(readme.process.bind(readme))

  utils
    .readFile(README_PATH)
    .then(readme => compile(readme))
    .then(data => utils.writeFile(README_PATH, data))
    .catch(utils.onError)
}
