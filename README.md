# cactus-utils

![hero](assets/cactus-hero.png)

> Cactus Utilities monorepo

---

## Table of contents

- [Packages](#packages)

- [Getting started](#getting-started)

  - [Installation](#installation)
  - [Incorporating upstream changes](#incorporating-upstream-changes)
  - [Developing packages](#developing-packages)

- [Maintainers](#maintainers)

- [License](#license)

## Packages

|                                                                Package | Description                                             |
| ---------------------------------------------------------------------: | :------------------------------------------------------ |
| [@cactus-technologies/node-application](./packages/application#readme) | Helper to manage PM2 App definitions and process states |
|                [@cactus-technologies/errors](./packages/errors#readme) | Errors module for Cactus Servers and Applications       |
|                [@cactus-technologies/logger](./packages/logger#readme) | Customized Pino Logger for Cactus projects              |
|      [@cactus-technologies/slack-notifier](./packages/notifier#readme) | Slack Notifications Manager                             |
|          [@cactus-technologies/api-request](./packages/request#readme) | Request helper                                          |
|                [@cactus-technologies/server](./packages/server#readme) | Basic Server for Cactus Webservices                     |
|                  [@cactus-technologies/utils](./packages/utils#readme) | Utility functions for node base apps                    |
|                    [@cactus-technologies/uuid](./packages/uuid#readme) | A set of Unique ID generators for JS apps               |

## Getting started

First, ensure you have Node v10+ and [yarn](https://yarnpkg.com) v1.0+ installed on your machine.

- [Lerna](https://lernajs.io/) manages inter-package dependencies in this monorepo.
- Builds are orchestrated via `lerna run` and NPM scripts.
- Our documentation is generated from `JSDoc comments`, `README.md`, `example.js` files via CI.

### Installation

```sh
git clone git@github.com:CactusTechnologies/cactus-utils.git cactus-utils
  cd cactus-utils
  npm install
```

### Incorporating upstream changes

If you were previously in a working state and have just pulled new code from `develop`:

- If there were package dependency changes, run `yarn` at the root.
  - This command is very quick if there are no new things to install.
- Run `yarn compile` to get the latest built versions of the library packages in this repo.
  - This command is quicker than `yarn verify` since it doesn't run tests

### Developing packages

Thanks for taking the time to care about the codebase! :tada: :confetti_ball: :+1:

1.  Create a new feature branch. We use a format like `[initials]/[feature]`: `jp/refactor-api`.
2.  Write some code. :hammer:
3.  Ensure your code is **tested???** and **linted**.
    - Add unit tests as necessary when fixing bugs or adding features; run them with `yarn test`
      in the relevant `packages/` directory. _(Wishfull thinking for the moment.)_
    - Linting is best handled by your editor for real-time feedback.
    - If you use [VS Code](https://code.visualstudio.com/) the project will recommend you to install the appropriate extentions.
    - Most lint errors can often be automatically fixed. Run lint fixes with `yarn fix`.
4.  Submit a Pull Request.
5.  Team members will review your code and merge it after approvals.
    - You may be asked to make modifications to code style or to fix bugs you may have not noticed.
    - _Do not_ amend commits and `push --force` as they break the PR history. Please add more commits.
6.  Hooray, you helped! :tophat:

## Maintainers

- [Jorge Proaño](mailto:jorge@cactus.is)

## License

[MIT](LICENSE) © [Cactus Technologies LLC](http://www.cactus.is)
