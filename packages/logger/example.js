/*!
 * Copyright 2019 Cactus Technologies, LLC. All rights reserved.
 */
const logger = require('./lib')
const log = logger('demo')

log.info('hello world')
console.log('json', '{"level":30,"time":0000000,"msg":"hello world","pid":5218,"hostname":"demo-host","name":"demo","v":1}')
log.error('this is at error level')
console.log('json', '{"level":50,"time":0000000,"msg":"this is at error level","pid":000,"hostname":"demo-host","name":"demo","v":1}')

// All arguments supplied after `message` are serialized and interpolated according to any supplied `printf-style` placeholders.
log.info('the answer is %d', 42)
console.log('json', '{"level":30,"time":0000000,"msg":"the answer is 42","pid":000,"hostname":"demo-host","name":"demo","v":1}')

// An `object` can optionally be supplied as the first parameter. Each enumerable key and value of the mergingObject is copied in to the JSON log line.
log.info({ a: { b: 'c' } }, 'Attachment')
console.log('json', '{"level":30,"time":0000000,"msg":"Nested Attachment","pid":000,"hostname":"demo-host","name":"demo","a":{"b":"c"},"v":1}')

// Errors get Serialized
log.error(new Error('an error'))
console.log('json', '{"level":50,"time":0000000,"msg":"an error","pid":000,"hostname":"demo-host","name":"demo",\n "err":{"message":"an error","name":"Error",\n"stack":"Error: an error\n    at Object.<anonymous> (/Users/mechanicalhuman/Active/cactus/utils/packages/logger/example.js:12:11)\n    at Module._compile (internal/modules/cjs/loader.js:689:30)\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:700:10)\n    at Module.load (internal/modules/cjs/loader.js:599:32)\n    at tryModuleLoad (internal/modules/cjs/loader.js:538:12)\n    at Function.Module._load (internal/modules/cjs/loader.js:530:3)\n    at Function.Module.runMain (internal/modules/cjs/loader.js:742:12)\n    at startup (internal/bootstrap/node.js:279:19)\n    at bootstrapNodeJSCore (internal/bootstrap/node.js:752:3)"},"v":1}')

// The `logger.child method` allows for the creation of stateful loggers, where `key-value` pairs can be pinned to a logger causing them to be output on every log line.
const child = log.child({ extra: 'property' })
child.info('hello child!')
console.log('json', '{"level":30,"time":0000000,"msg":"hello child!","pid":000,"hostname":"demo-host","name":"demo","extra":"property","v":1}')
