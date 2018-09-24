# @cactus-technologies/logger

![version](https://img.shields.io/badge/version-2.1.3-green.svg)
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
```

## API

## Maintainers

-   [Jorge Proaño](http://www.hidden-node-problem.com)

## Changelog

Find the CHANGELOG [here](CHANGELOG.md), generated using Conventional Commits.

## License

[MIT](LICENSE) © [Cactus Technologies LLC](http://www.cactus.is)
