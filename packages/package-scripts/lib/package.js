'use strict'

const Listr = require('listr')
const fp = require('lodash/fp')
const readPkg = require('read-pkg')
const sort = require('sort-package-json')
const { normalize } = require('@cactus-technologies/license-generator')

const utils = require('./utils')
const { IN_REPO, AUTHOR, PKG_PATH } = require('./constants')

const tasks = new Listr([
  {
    title: 'Normalize package.json',
    task: ctx => readPkg().then(pkg => (ctx.pkg = pkg))
  },
  {
    title: 'Ensuring git-remote matches the project.',
    skip: ctx => !IN_REPO || !ctx.remote,
    task: ctx =>
      Promise.resolve()
        .then(() => ctx.repoData.toString('ssh'))
        .then(gitURl => updateCtx('repository.url', gitURl, ctx))
        .then(() => updateCtx('repository.type', 'git', ctx))
  },
  {
    title: 'Updating Contributors',
    task: ctx =>
      fp.pipe(
        ctx =>
          fp.isEmpty(ctx.contributors)
            ? fp.getOr([], 'pkg.contributors')
            : ctx.contributors,
        fp.map(
          fp.pipe(
            utils.parsePerson,
            utils.unParsePerson
          )
        ),
        ctr => updateCtx('contributors', ctr, ctx)
      )(ctx)
  },
  {
    title: 'Ensuring Author is Cactus.is',
    task: ctx => updateCtx('author', AUTHOR, ctx)
  },
  {
    title: 'Ensuring Valid Licence',
    task: ctx => {
      const current = fp.getOr('UNLICENSED', 'pkg.license')(ctx)
      updateCtx('license', normalize(current), ctx)
    }
  },
  {
    title: 'Saving',
    task: ctx => utils.writeJson(PKG_PATH, cleanUp(ctx))
  }
])

module.exports = () => tasks

function updateCtx (path, val, ctx) {
  const pkg = fp.get('pkg')(ctx)
  ctx.pkg = fp.set(path, val, pkg)
  return ctx
}

function cleanUp (ctx) {
  const pkg = fp.pipe(
    fp.get('pkg'),
    fp.omit(['_id', 'readmeFilename', 'readme']),
    fp.omitBy(fp.allPass([fp.isEmpty, fp.negate(fp.isBoolean)])),
    pkg => sort(pkg)
  )(ctx)
  ctx.pkg = pkg
  return pkg
}
