<!-- TITLE/ -->

<h1>@cactus-technologies/logger</h1>

<!-- /TITLE -->

<!-- DESCRIPTION/ -->

Customized Pino Logger for Cactus projects

<!-- /DESCRIPTION -->

<!-- INSTALL/ -->

<h2>Install</h2>

<a href="https://npmjs.com" title="npm is a package manager for javascript"><h3>NPM</h3></a><ul>

<li>Install: <code>npm install --save @cactus-technologies/logger</code></li>
<li>Module: <code>require('@cactus-technologies/logger')</code></li></ul>

<!-- /INSTALL -->

## Example

```js
'use strict'
const logger = require('@cactus-technologies/logger')
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

<!-- LICENSE/ -->

<h2>License</h2>

Unless stated otherwise all works are:

<ul><li>Copyright &copy; <a href="http://www.cactus.is">Cactus Technologies LLC</a></li></ul>

and licensed under:

<ul><li><a href="http://spdx.org/licenses/MIT.html">MIT License</a></li></ul>

<!-- /LICENSE -->
