# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.1.5](https://ssh.dev.azure.com/Cactus%20Internal/cactus-utilities/compare/@cactus-technologies/notifier@1.1.4...@cactus-technologies/notifier@1.1.5) (2019-01-22)

**Note:** Version bump only for package @cactus-technologies/notifier

# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="1.1.4"></a>

## 1.1.4 (2019-01-17)

### Bug Fixes

-   Catching incorrect url error ([cd94e14](https://ssh.dev.azure.com/Cactus%20Internal/cactus-utilities/commits/cd94e14))
-   **application:** Changing mode 100755 => 100644 ([fed14a7](https://ssh.dev.azure.com/Cactus%20Internal/cactus-utilities/commits/fed14a7))
-   **application:** Incorrect name for the default export. ([b3292a8](https://ssh.dev.azure.com/Cactus%20Internal/cactus-utilities/commits/b3292a8))
-   **application:** pm2 definition was using out/error instead of the cannonical out_file ([45d0d78](https://ssh.dev.azure.com/Cactus%20Internal/cactus-utilities/commits/45d0d78))
-   **application:** Slack Notifications were incorrectly expecting a JSON object from the slack api r… ([19e8584](https://ssh.dev.azure.com/Cactus%20Internal/cactus-utilities/commits/19e8584))
-   **cz-cactus:** added inquirer as a dependency ([c7256b8](https://ssh.dev.azure.com/Cactus%20Internal/cactus-utilities/commits/c7256b8))
-   **cz-cactus:** Passing the package discovered scopes on chore ([a13eee0](https://ssh.dev.azure.com/Cactus%20Internal/cactus-utilities/commits/a13eee0))
-   **errors:** Casting all props to strings before passing it to the constructor ([611eb16](https://ssh.dev.azure.com/Cactus%20Internal/cactus-utilities/commits/611eb16))
-   **eslint-config:** Added Licence ([95a77e6](https://ssh.dev.azure.com/Cactus%20Internal/cactus-utilities/commits/95a77e6))
-   require('url').parse(url) ([092ee81](https://ssh.dev.azure.com/Cactus%20Internal/cactus-utilities/commits/092ee81))

### Features

-   **application:** Removed Stacktrace from the slack notifications. ([2f92c69](https://ssh.dev.azure.com/Cactus%20Internal/cactus-utilities/commits/2f92c69))
-   **application:** Revamped pm2 configuration ([c722e5c](https://ssh.dev.azure.com/Cactus%20Internal/cactus-utilities/commits/c722e5c))
-   **cz-cactus:** Added NONE and Scripts to the chore scopes ([7617a32](https://ssh.dev.azure.com/Cactus%20Internal/cactus-utilities/commits/7617a32))
-   **cz-cactus:** Default answers dont prompt for additional data. ([59f3d3f](https://ssh.dev.azure.com/Cactus%20Internal/cactus-utilities/commits/59f3d3f))
-   **eslint-config:** Enforcing lodahs and no console ([6ec3593](https://ssh.dev.azure.com/Cactus%20Internal/cactus-utilities/commits/6ec3593))
-   **eslint-config:** Exporting custom react and module configs ([0a94964](https://ssh.dev.azure.com/Cactus%20Internal/cactus-utilities/commits/0a94964))
-   **monorepo:** Added basic typescript declarations ([0833169](https://ssh.dev.azure.com/Cactus%20Internal/cactus-utilities/commits/0833169))
-   **package-scripts:** Added version and todos to the scripts ([97ec4c2](https://ssh.dev.azure.com/Cactus%20Internal/cactus-utilities/commits/97ec4c2))
-   **package-scripts:** Adds basic commands ([02e60d9](https://ssh.dev.azure.com/Cactus%20Internal/cactus-utilities/commits/02e60d9))
-   **utils:** Explanding the promise chains ([8a1328c](https://ssh.dev.azure.com/Cactus%20Internal/cactus-utilities/commits/8a1328c))

### Performance Improvements

-   **server:** Not using frameguard ([aa7848e](https://ssh.dev.azure.com/Cactus%20Internal/cactus-utilities/commits/aa7848e))

### Reverts

-   **application:** Locking [@pm2](https://ssh.dev.azure.com/pm2)/io to 2.3.3 due breaking hcanges in their API ([7bd8409](https://ssh.dev.azure.com/Cactus%20Internal/cactus-utilities/commits/7bd8409))
-   **application:** Reverting to the last published version ([676920a](https://ssh.dev.azure.com/Cactus%20Internal/cactus-utilities/commits/676920a))

### BREAKING CHANGES

-   **application:** removed instance.toObject() and static.compileApps()
