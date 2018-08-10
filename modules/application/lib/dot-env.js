'use strict'

const fs = require('fs')
const path = require('path')
const dotenv = require('dotenv')
const os = require('os')
const fp = require('lodash/fp')
const debug = require('debug')('cactus:app:env')

// ─────────────────────────────────  MAIN  ────────────────────────────────────

module.exports = function main () {
  /* Allways run on strict mode */
  process.env.NODE_CONFIG_STRICT_MODE = true

  /* Default NODE_ENV to development */
  const HAS_ENV = Boolean(process.env.NODE_ENV)
  const DEFAULT_ENV = 'development'
  if (!HAS_ENV) {
    debug('No value found for NODE_ENV, setting to: %o', DEFAULT_ENV)
  }
  if (!HAS_ENV) process.env.NODE_ENV = DEFAULT_ENV

  let appRoot = process.cwd()

  /* Check for electron and change the NODE_CONFIG_DIR */
  if (process.versions && process.versions.electron) {
    const electron = require('electron')
    if (process.type === 'browser') appRoot = electron.app.getAppPath()
    if (process.type === 'renderer') appRoot = electron.remote.app.getAppPath()
    const configDir = path.resolve(appRoot, 'config')
    debug('Setting NODE_CONFIG_DIR to: %s', prettyPath(configDir))
    debug('Setting CACTUS_APP_ROOT to: %s', prettyPath(appRoot))
    process.env.NODE_CONFIG_DIR = configDir
    process.env.CACTUS_APP_ROOT = appRoot
  }

  /** Loads .env if exists */
  const env = path.resolve(appRoot, '.env')
  if (fs.existsSync(env)) debug('Loading .env file from %s', prettyPath(env))
  if (fs.existsSync(env)) dotenv.config({ path: env })

  function prettyPath (path) {
    return fp.pipe(
      fp.replace(appRoot + '/', appRoot === process.cwd() ? '[cwd]' : '[app]'),
      fp.replace(process.cwd() + '/', '[cwd]'),
      fp.replace(os.homedir(), '~')
    )(path)
  }
}
