'use strict'
const logger = require('.')
const log = logger('app')

log.info('hello world')
log.error('this is at error level')
log.info('the answer is %d', 42)
log.info({ obj: 42 }, 'hello world')
log.info({ obj: 42, b: 2 }, 'hello world')
log.info({ obj: { aa: 'bbb' } }, 'another')
log.error(new Error('an error'))

const child = log.child({ a: 'property' })
child.info('hello child!')
