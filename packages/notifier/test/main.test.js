/*!
 * Copyright 2019 Cactus Technologies, LLC. All rights reserved.
 */

/* eslint-env mocha */

const chai = require('chai')
const { expect } = chai

const importFresh = require('import-fresh')

const testHook =
  'https://hooks.slack.com/services/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'

// Begin environment test
describe('Environment', function () {
  before(function () {
    delete process.env.NODE_CONFIG
    delete process.env.CACTUS_SLACK_HOOK
    delete process.env.CACTUS_SLACK_ENABLE
  })

  afterEach(function () {
    delete process.env.CACTUS_SLACK_HOOK
    delete process.env.CACTUS_SLACK_ENABLE
  })

  // Ensure testing environment is configured
  it('should be respect env variables', function () {
    process.env.CACTUS_SLACK_ENABLE = 'true'
    process.env.CACTUS_SLACK_HOOK = testHook

    importFresh('config')
    const notifier = importFresh('..')

    expect(notifier.enabled).to.equal(true)
    expect(notifier.hook).to.equal(testHook)
  })
})

describe('Active discovery', function () {
  before(function () {
    delete process.env.NODE_CONFIG
    delete process.env.CACTUS_SLACK_HOOK
    delete process.env.CACTUS_SLACK_ENABLE
  })

  afterEach(function () {
    delete process.env.NODE_CONFIG
  })

  it('should be active if enabled and there is a hook', function () {
    process.env.NODE_CONFIG = JSON.stringify({
      slack: { enable: true, hook: testHook }
    })

    importFresh('config')
    const notifier = importFresh('..')
    expect(notifier.active).to.equal(true)
  })

  it('should be NOT be active if enabled and there is not a hook', function () {
    process.env.NODE_CONFIG = JSON.stringify({
      slack: { enable: true }
    })

    importFresh('config')
    const notifier = importFresh('..')
    expect(notifier.active).to.equal(false)
  })

  it('should be NOT be active if disabled and there is a hook', function () {
    process.env.NODE_CONFIG = JSON.stringify({
      slack: { enable: false, hook: testHook }
    })

    importFresh('config')
    const notifier = importFresh('..')
    expect(notifier.active).to.equal(false)
  })
})

describe('messages', function () {
  before(function () {
    delete process.env.NODE_CONFIG
    delete process.env.CACTUS_SLACK_HOOK
    delete process.env.CACTUS_SLACK_ENABLE
  })
  process.env.NODE_CONFIG = JSON.stringify({
    slack: { enable: true, hook: testHook }
  })
  importFresh('config')
  const notifier = importFresh('..')

  it('should send messages', function () {
    console.log({ notifier })
    expect(notifier.active).to.equal(true)
  })
})
