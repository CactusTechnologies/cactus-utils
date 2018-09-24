'use strict'

const Listr = require('listr')
const fp = require('lodash/fp')
const gitParser = require('git-url-parse')
const execa = require('execa')
const ghGot = require('gh-got')
const map = require('p-map')

const { GITHUB_ACCESS_TOKEN, ERR_GIT } = require('../constants')
const utils = require('../utils')

const isGitHub = fp.pipe(
  fp.get('repoData'),
  fp.get('source'),
  fp.equals('github.com')
)

const getGitHubCnt = fp.pipe(
  fp.get('repoData'),
  fp.get('full_name'),
  repo => `/repos/${repo}/contributors`
)

const parseAuthors = fp.pipe(
  fp.split(/\r?\n/g),
  fp.map(
    fp.pipe(
      fp.replace(/^\s*#.*$/, ''),
      fp.trim
    )
  ),
  fp.compact,
  fp.map(utils.parsePerson)
)

module.exports = () =>
  new Listr([
    {
      title: 'Get Git remote',
      task: ctx =>
        execa
          .stdout('git', ['config', '--get', 'remote.origin.url'])
          .then(remote => gitParser(remote))
          .then(repoData => (ctx.repoData = repoData))
          .then(() => (ctx.remote = true))
          .catch(e => {
            throw new Error(ERR_GIT)
          })
    },
    {
      title: 'Get Contributors via local Repo',
      task: ctx =>
        execa
          .shell('git log --format="%aN <%aE>" | sort -f | uniq')
          .then(data => parseAuthors(data.stdout))
          .then(cnt => mergeContributors(ctx, cnt))
    },
    {
      title: 'Get Contributors via Github API',
      enabled: ctx => doGitHub(ctx),
      task: ctx =>
        ghGot(getGitHubCnt(ctx), { token: GITHUB_ACCESS_TOKEN })
          .then(({ body }) => map(body, getContributorData, { concurrent: 2 }))
          .then(cnt => mergeContributors(ctx, cnt))
    }
  ])

function getContributorData (cnt) {
  return ghGot(cnt.url, { token: GITHUB_ACCESS_TOKEN })
    .then(({ body }) => cleanData(body))
    .catch(() => {})

  function cleanData ({ name, email, blog, html_url: ghUrl }) {
    return {
      name,
      email,
      url: fp.isEmpty(blog) ? ghUrl : blog
    }
  }
}

function doGitHub (ctx) {
  if (isGitHub(ctx) === false) return false
  if (GITHUB_ACCESS_TOKEN === false) return false
  return true
}

function mergeContributors (context, contr) {
  const current = fp.getOr([], 'contributors', context)
  const merged = fp.unionBy((x = {}) => x.email)(contr, current)
  context['contributors'] = fp.compact(merged)
}
