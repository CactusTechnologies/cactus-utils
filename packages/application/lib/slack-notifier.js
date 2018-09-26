'use strict'

const fp = require('lodash/fp')
const config = require('config')
const moment = require('moment-timezone')
const log = require('@cactus-technologies/logger')('slack')
const req = require('got')

exports.info = async attachment => notifier('info', attachment)

exports.warn = async attachment => notifier('warn', attachment)

exports.error = async attachment => notifier('error', attachment)

async function notifier (level, attachment) {
  if (config.has('slack.url') === false) return false

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
        { title: 'pid', value: process.pid, short: true }
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
    await req.post(config.get('slack.url'), {
      body: {
        text: text,
        attachments: attachments
      },
      json: true
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
