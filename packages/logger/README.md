# @cactus-technologies/logger

![version](https://img.shields.io/badge/version-2.2.1-green.svg)
![npm](https://img.shields.io/badge/npm-private-red.svg)

> Customized Pino Logger for Cactus projects

---

## Table of contents

-   [Installation](#installation)
-   [Usage](#usage)
-   [API](#api)
-   [Maintainers](#maintainers)
-   [Changelog](#changelog)
-   [License](#license)

## Installation

```sh
npm install @cactus-technologies/logger
```

## Usage

```javascript
const logger = require('.')
const log = logger('demo')
log.info('hello world')
```

```json
{
    "level": 30,
    "time": 0000000,
    "msg": "hello world",
    "pid": 5218,
    "hostname": "demo-host",
    "name": "demo",
    "v": 1
}
```

```javascript
log.error('this is at error level')
```

```json
{
    "level": 50,
    "time": 0000000,
    "msg": "this is at error level",
    "pid": 000,
    "hostname": "demo-host",
    "name": "demo",
    "v": 1
}
```

All arguments supplied after `message` are serialized and interpolated according to any supplied `printf-style` placeholders.

```javascript
log.info('the answer is %d', 42)
```

```json
{
    "level": 30,
    "time": 0000000,
    "msg": "the answer is 42",
    "pid": 000,
    "hostname": "demo-host",
    "name": "demo",
    "v": 1
}
```

An `object` can optionally be supplied as the first parameter. Each enumerable key and value of the mergingObject is copied in to the JSON log line.

```javascript
log.info({ a: { b: 'c' } }, 'Attachment')
```

```json
{
    "level": 30,
    "time": 0000000,
    "msg": "Nested Attachment",
    "pid": 000,
    "hostname": "demo-host",
    "name": "demo",
    "a": { "b": "c" },
    "v": 1
}
```

Errors get Serialized

```javascript
log.error(new Error('an error'))
```

```json
{"level":50,"time":0000000,"msg":"an error","pid":000,"hostname":"demo-host","name":"demo",
 "err":{"message":"an error","name":"Error",
"stack":"Error: an error
    at Object.<anonymous> (/Users/mechanicalhuman/Active/cactus/utils/packages/logger/example.js:12:11)
    at Module._compile (internal/modules/cjs/loader.js:689:30)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:700:10)
    at Module.load (internal/modules/cjs/loader.js:599:32)
    at tryModuleLoad (internal/modules/cjs/loader.js:538:12)
    at Function.Module._load (internal/modules/cjs/loader.js:530:3)
    at Function.Module.runMain (internal/modules/cjs/loader.js:742:12)
    at startup (internal/bootstrap/node.js:279:19)
    at bootstrapNodeJSCore (internal/bootstrap/node.js:752:3)"},"v":1}
```

The `logger.child method` allows for the creation of stateful loggers, where `key-value` pairs can be pinned to a logger causing them to be output on every log line.

```javascript
const child = log.child({ extra: 'property' })
child.info('hello child!')
```

```json
{
    "level": 30,
    "time": 0000000,
    "msg": "hello child!",
    "pid": 000,
    "hostname": "demo-host",
    "name": "demo",
    "extra": "property",
    "v": 1
}
```

## API

## Maintainers

-   [Jorge Proaño](http://www.hidden-node-problem.com)

## Changelog

Find the CHANGELOG [here](CHANGELOG.md), generated using Conventional Commits.

## License

[MIT](LICENSE) © [Cactus Technologies LLC](http://www.cactus.is)
