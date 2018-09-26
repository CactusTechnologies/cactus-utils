'use strict'

const fs = require('fs')
const path = require('path')
const dotenv = require('dotenv')

/* Default NODE_ENV to development */
process.env.NODE_ENV = process.env.NODE_ENV || 'development'

/* Allways run on strict mode */
process.env.NODE_CONFIG_STRICT_MODE = 'true'

let appRoot = process.cwd()

/* Check for electron and change the process.cwd() */
if (process.versions && process.versions.electron) {
  if (process.type === 'browser') {
    appRoot = require('electron').app.getAppPath()
  } else if (process.type === 'renderer') {
    appRoot = require('electron').remote.app.getAppPath()
  }
  process.chdir(appRoot)
}

/** Loads .env if exists */
module.exports = () => {
  const env = path.resolve(process.cwd(), '.env')
  if (fs.existsSync(env)) process.stdout.write('Loading .env in to the ENV\n')
  if (fs.existsSync(env)) dotenv.config({ path: env })
}
