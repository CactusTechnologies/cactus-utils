<!--@h1([pkg.name])-->

# @cactus-technologies/logger

<!--/@-->

<!--@pkg.description-->

Customized Pino Logger for Cactus projects

<!--/@-->

<!--@installation()-->

## Installation

```sh
npm install --save @cactus-technologies/logger
```

<!--/@-->

## Example

<!--@snippet('./example/index.js')-->

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

<!--/@-->

<!--@snippet('./TODO.md')-->

```md
### TODOs

| Filename                 | line # | TODO                                                     |
| :----------------------- | :----: | :------------------------------------------------------- |
| [index.js](index.js#L38) |   38   | Investigate how to pass the stream via the config files. |
```

<!--/@-->

<!--@license()-->

## License

[UNLICENCED](./LICENSE) © [Cactus Technologies, LLC](https://www.cactus.is)

<!--/@-->
