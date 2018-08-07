'use strict'

const io = require('@pm2/io')
const { promisify } = require('util')

  get usePmx () {
    const usePmx =
      this.config.has('notifier.pm2') &&
      this.config.get('notifier.pm2') === true &&
      process.env.km_link === 'true'
    return usePmx
  }

  get useSlack () {
    const useSlack =
      this.config.has('notifier.slack') &&
      this.config.get('notifier.slack') !== false
    return useSlack
  }
