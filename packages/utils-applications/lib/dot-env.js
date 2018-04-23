const fs = require('fs')
const path = require('path')

/** Loads .env if exists */
module.exports = () => {
  const dotEnv = path.resolve(process.cwd(), '.env')
  if (fs.existsSync(dotEnv)) console.log('Loading .env in to the ENV')
  if (fs.existsSync(dotEnv)) require('dotenv').config()
}
