'use strict'

const fp = require('lodash/fp')
const { promisify } = require('util')
let notifier = fp.noop

exports.init = function init () {
  /* Load dependencies on init */
  const request = require('request')
  const moment = require('moment-timezone')
  const config = require('config')
  const log = require('@cactus-technologies/logger')('slack')

  const req = promisify(request.post).bind(request)

  const slack = async (payload = {}) =>
    req({
      uri: config.get('slack.url'),
      body: payload,
      json: true,
      time: true
    })

  notifier = async function notifier (
    level,
    message,
    source = 'process',
    attachment = {}
  ) {
    try {
      const payload = {
        attachments: [
          {
            fallback: `${config.get('service')} - ${source}: ${message}`,
            author_name: config.get('service'),
            title: `${source}: ${message}`,
            color: level,
            fields: fp.pipe(
              fp.toPairs,
              prop => {
                const value = String(prop[1])
                return {
                  title: prop[0],
                  value: value,
                  short: value.lenght < 10
                }
              }
            )(attachment),
            ts: moment().unix()
          }
        ]
      }

      await slack(payload)
      return true
    } catch (err) {
      log.error(err)
      return false
    }
  }
}

exports.info = async (message, source, attachment) => {
  return notifier('good', message, source, attachment)
}

exports.warn = async (message, source, attachment) => {
  return notifier('warning', message, source, attachment)
}

exports.error = async (message, source, attachment) => {
  return notifier('danger', message, source, attachment)
}
