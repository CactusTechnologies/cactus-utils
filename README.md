# @cactus-technologies/utils-monorepo

![version](https://img.shields.io/badge/version-1.1.1-green.svg)

> Cactus Utilities monorepo

---

## Table of contents

-   [Installation](#installation)
-   [Maintainers](#maintainers)
-   [License](#license)
-   [TODOs](#todos)

## Installation

```sh
git clone git@github.com:CactusTechnologies/cactus-utils.git cactus-utils
  cd cactus-utils
  npm install
```

## Maintainers

-   [Jorge Proaño](http://www.hidden-node-problem.com)

## License

[MIT](LICENSE) © [Cactus Technologies LLC](http://www.cactus.is)

## TODOs

TODO

-   `packages/logger/index.js`


    -   [ ] [SUPPRESS_NO_CONFIG_WARNING](packages/logger/index.js#11)
    -   [ ] [Investigate how to pass the stream via the config files.](packages/logger/index.js#40)

-   `packages/utils/index.js`


    -   [ ] [Propper attributions](packages/utils/index.js#10)
    -   [ ] [Detect and use the native promisified versions](packages/utils/index.js#87)
    -   [ ] [Use cripto.createCipheriv](packages/utils/index.js#608)
    -   [ ] [Use cripto.createDecipheriv](packages/utils/index.js#627)

-   `notes/merging/lib/Application.js`


    -   [ ] [Use the pino.final special logger to avoid missing logs](notes/merging/lib/Application.js#123)

-   `packages/server/lib/pre.js`


    -   [ ] [AllowHeaders should read as an array.](packages/server/lib/pre.js#69)
