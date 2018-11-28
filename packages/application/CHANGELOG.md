# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [4.1.5](http://cactus-bk@dev.azure.com:cactus-bk/cactus-tools/_git/utils-monorepo/compare/@cactus-technologies/node-application@4.1.4...@cactus-technologies/node-application@4.1.5) (2018-11-28)

**Note:** Version bump only for package @cactus-technologies/node-application

## [4.1.4](http://cactus-bk@dev.azure.com:cactus-bk/cactus-tools/_git/utils-monorepo/compare/@cactus-technologies/node-application@4.1.3...@cactus-technologies/node-application@4.1.4) (2018-11-28)

**Note:** Version bump only for package @cactus-technologies/node-application

<a name="4.1.3"></a>

## [4.1.3](https://github.com/CactusTechnologies/cactus-utils/compare/@cactus-technologies/node-application@4.1.2...@cactus-technologies/node-application@4.1.3) (2018-10-03)

**Note:** Version bump only for package @cactus-technologies/node-application

<a name="4.1.2"></a>

## [4.1.2](https://github.com/CactusTechnologies/cactus-utils/compare/@cactus-technologies/node-application@4.1.1...@cactus-technologies/node-application@4.1.2) (2018-10-02)

### Bug Fixes

-   **application:** Slack Notifications were incorrectly expecting a JSON object from the slack api r… ([19e8584](https://github.com/CactusTechnologies/cactus-utils/commit/19e8584))

<a name="4.1.1"></a>

## [4.1.1](https://github.com/CactusTechnologies/cactus-utils/compare/@cactus-technologies/node-application@4.1.0...@cactus-technologies/node-application@4.1.1) (2018-09-26)

### Bug Fixes

-   **application:** pm2 definition was using out/error instead of the cannonical out_file ([45d0d78](https://github.com/CactusTechnologies/cactus-utils/commit/45d0d78))

<a name="4.1.0"></a>

# [4.1.0](https://github.com/CactusTechnologies/cactus-utils/compare/@cactus-technologies/node-application@4.0.3...@cactus-technologies/node-application@4.1.0) (2018-09-24)

### Features

-   **monorepo:** Added basic typescript declarations ([0833169](https://github.com/CactusTechnologies/cactus-utils/commit/0833169))

<a name="4.0.3"></a>

## [4.0.3](https://github.com/CactusTechnologies/cactus-utils/compare/@cactus-technologies/node-application@4.0.2...@cactus-technologies/node-application@4.0.3) (2018-09-19)

**Note:** Version bump only for package @cactus-technologies/node-application

<a name="4.0.2"></a>

## [4.0.2](https://github.com/CactusTechnologies/cactus-utils/compare/@cactus-technologies/node-application@4.0.1...@cactus-technologies/node-application@4.0.2) (2018-09-12)

**Note:** Version bump only for package @cactus-technologies/node-application

<a name="4.0.1"></a>

## [4.0.1](https://github.com/CactusTechnologies/cactus-utils/compare/@cactus-technologies/node-application@4.0.0...@cactus-technologies/node-application@4.0.1) (2018-09-05)

**Note:** Version bump only for package @cactus-technologies/node-application

<a name="4.0.0"></a>

# [4.0.0](https://github.com/CactusTechnologies/cactus-utils/compare/@cactus-technologies/node-application@3.1.0...@cactus-technologies/node-application@4.0.0) (2018-09-05)

### Features

-   **application:** Revamped pm2 configuration ([c722e5c](https://github.com/CactusTechnologies/cactus-utils/commit/c722e5c))

### Reverts

-   **application:** Locking [@pm2](https://github.com/pm2)/io to 2.3.3 due breaking hcanges in their API ([7bd8409](https://github.com/CactusTechnologies/cactus-utils/commit/7bd8409))

### BREAKING CHANGES

-   **application:** removed instance.toObject() and static.compileApps()

<a name="3.1.0"></a>

# [3.1.0](https://github.com/CactusTechnologies/cactus-utils/compare/@cactus-technologies/node-application@3.0.6...@cactus-technologies/node-application@3.1.0) (2018-09-04)

### Features

-   **application:** Removed Stacktrace from the slack notifications. ([2f92c69](https://github.com/CactusTechnologies/cactus-utils/commit/2f92c69))

<a name="3.0.6"></a>

## [3.0.6](https://github.com/CactusTechnologies/cactus-utils/compare/@cactus-technologies/node-application@3.0.5...@cactus-technologies/node-application@3.0.6) (2018-08-29)

### Bug Fixes

-   **application:** Incorrect name for the default export. ([b3292a8](https://github.com/CactusTechnologies/cactus-utils/commit/b3292a8))

<a name="3.0.5"></a>

## 3.0.5 (2018-08-29)

### Bug Fixes

-   **application:** Changing mode 100755 => 100644 ([fed14a7](https://github.com/CactusTechnologies/cactus-utils/commit/fed14a7))

### Reverts

-   **application:** Reverting to the last published version ([676920a](https://github.com/CactusTechnologies/cactus-utils/commit/676920a))
