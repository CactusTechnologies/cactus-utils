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
      json: true
    })

  notifier = async function notifier (level, source, attachment) {
    const now = moment().unix()

    const name = fp.startCase(`${config.get('basename')} ${config.get('name')}`)

    const text =
      level === 'info'
        ? `*Message from ${name}*:`
        : level === 'warn'
          ? `*There is a warning on ${name}*:`
          : level === 'error'
            ? `*An error ocurred on ${name}*:`
            : `*${name}*:`

    const color =
      level === 'info'
        ? 'good'
        : level === 'warn'
          ? 'warning'
          : level === 'error'
            ? 'danger'
            : ''

    const attachments = []

    if (level === 'warn' || level === 'error') {
      attachments.push({
        title: 'Process info:',
        fallback: `Process info: ${config.get('host')} - ${process.pid}`,
        color: '#258278',
        fields: [
          { title: 'App Name', value: config.get('service'), short: true },
          { title: 'Host', value: config.get('host'), short: true },
          { title: 'Version', value: config.get('version'), short: true },
          { title: 'pid', value: process.pid, short: true },
          source ? { title: 'Component', value: source, short: true } : null
        ]
      })
    }

    if (
      !fp.isEmpty(attachment) &&
      !fp.isArray(attachment) &&
      !fp.isString(attachment)
    ) {
      attachments.push(prepareAttachment(attachment))
    }

    if (
      !fp.isEmpty(attachment) &&
      !fp.isArray(attachment) &&
      fp.isString(attachment)
    ) {
      attachments.push({
        color: color,
        text: attachment,
        ts: now
      })
    }

    if (!fp.isEmpty(attachment) && fp.isArray(attachment)) {
      attachment.forEach(att => attachments.push(prepareAttachment(att)))
    }

    try {
      await slack({
        text: text,
        attachments: attachments
      })
      return true
    } catch (err) {
      log.error(err)
      return false
    }

    function prepareAttachment (obj) {
      return {
        color: color,
        fields: fp.pipe(
          fp.toPairs,
          fp.map(([key, value]) => {
            if (fp.isNil(value)) return
            if (key === 'stack') return
            value = String(value)
            // if (key === 'stack') {
            //   return {
            //     fallback: `${fp.startCase(key)}: Stack`,
            //     title: fp.startCase(key),
            //     value: (value = '```' + value + '```'),
            //     short: false
            //   }
            // }
            return {
              fallback: `${fp.startCase(key)}: ${value}}`,
              title: fp.startCase(key),
              value: value,
              short: value.length < 20
            }
          }),
          fp.compact
        )(obj),
        ts: now
      }
    }
  }
}

exports.info = async (attachment, source) => {
  return notifier('info', source, attachment)
}

exports.warn = async (attachment, source) => {
  return notifier('warn', source, attachment)
}

exports.error = async (attachment, source) => {
  return notifier('error', source, attachment)
}
