'use strict'

const fp = require('lodash/fp')
const { promisify } = require('@cactus-technologies/utils')
const request = require('request')
const debug = require('debug')('cactus:app:slack')
const req = promisify(request.post).bind(request)

module.exports = notifier

// ────────────────────────────────  Private  ──────────────────────────────────

function slack (payload = {}) {
  return req({
    uri: require('config').get('notifier.slack'),
    body: payload,
    timeout: 1000,
    json: true
  })
}

function notifier (level, source, attachment, done = fp.noop) {
  debug('level: %s', level)

  const config = require('config')
  const logger = require('@cactus-technologies/logger')
  const log = logger('slack')
  const now = Date.now()

  const name = fp.startCase(`${config.get('domain')} ${config.get('name')}`)

  const text =
    level === 'info'
      ? `*New event at ${name}*:`
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

  if (fp.isError(attachment)) {
    attachment = logger.Serializers.err(attachment)
  }

  if (
    !fp.isEmpty(attachment) &&
    !fp.isArray(attachment) &&
    !fp.isString(attachment)
  ) {
    if (level === 'info') {
      attachments.push({
        color: color,
        fields: [
          {
            title: 'Event',
            value: source,
            short: false
          },
          {
            title: 'Payload',
            value: '```' + JSON.stringify(attachment, null, 4) + '```',
            short: false
          }
        ],
        ts: now
      })
    } else {
      attachments.push(prepareAttachment(attachment))
    }
  }

  if (
    !fp.isEmpty(attachment) &&
    !fp.isArray(attachment) &&
    fp.isString(attachment)
  ) {
    if (level === 'info') {
      attachments.push({
        color: color,
        fields: [
          {
            title: 'Event',
            value: source,
            short: false
          },
          {
            title: 'Message',
            value: attachment,
            short: false
          }
        ],
        ts: now
      })
    } else {
      attachments.push({
        color: color,
        text: attachment,
        ts: now
      })
    }
  }

  if (!fp.isEmpty(attachment) && fp.isArray(attachment)) {
    if (level === 'info') {
      attachments.push({
        color: color,
        fields: [
          {
            title: 'Event',
            value: source,
            short: false
          },
          {
            title: 'Payload',
            value: '```' + JSON.stringify(attachment, null, 4) + '```',
            short: false
          }
        ],
        ts: now
      })
    } else {
      attachment.forEach(att => attachments.push(prepareAttachment(att)))
    }
  }

  if (fp.isEmpty(attachment) && level === 'info') {
    attachments.push({
      fields: [
        {
          title: 'Event',
          value: source,
          short: false
        }
      ],
      color: color,
      ts: now
    })
  }

  if (level !== 'info' && source) {
    attachments.push({
      color: color,
      fields: [
        {
          title: 'Component',
          value: source,
          short: false
        }
      ]
    })
  }

  attachments.push({
    title: 'Process info:',
    fallback: `Process info: ${config.get('host')} - ${process.pid}`,
    color: '#258278',
    fields: [
      {
        title: 'Service',
        value: config.get('service'),
        short: true
      },
      {
        title: 'Version',
        value: config.get('version'),
        short: true
      },
      { title: 'Machine Name', value: config.get('host'), short: true },
      { title: 'pid', value: process.pid, short: true }
    ]
  })

  debug('title: %s', text)
  debug('attachments: %O', attachments)

  slack({
    text: text,
    attachments: attachments
  })
    .then(() => done(null, true))
    .catch(err => {
      log.error(err)
      done(err, false)
    })

  function prepareAttachment (obj) {
    const prepared = {
      color: color,
      fields: fp.pipe(
        fp.toPairs,
        fp.map(([key, value]) => {
          if (fp.isNil(value)) return
          value = String(value)
          if (key === 'stack') {
            return {
              fallback: `${fp.startCase(key)}: Stack`,
              title: fp.startCase(key),
              value: (value = '```' + value + '```'),
              short: false
            }
          }
          return {
            fallback: `${fp.startCase(key)}: ${value}}`,
            title: fp.startCase(key),
            value: value,
            short: value.length < 30
          }
        }),
        fp.compact
      )(obj),
      ts: now
    }
    if (level === 'info') return { title: source, ...prepared }
    return prepared
  }
}
