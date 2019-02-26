/*!
 * Copyright 2019 Cactus Technologies, LLC. All rights reserved.
 */

/* eslint-env mocha */

const { expect } = require('chai')

const importFresh = require('import-fresh')

// Begin environment test

describe('External Configuration', function () {
  before(function () {
    delete process.env.NODE_CONFIG
    delete process.env.CACTUS_LOGS_LEVEL
    delete process.env.CACTUS_LOGS_PRETTY
  })

  afterEach(function () {
    delete process.env.CACTUS_LOGS_LEVEL
    delete process.env.CACTUS_LOGS_PRETTY
  })

  // Ensure testing environment is configured
  it('should be respect env variables', function () {
    process.env.CACTUS_LOGS_PRETTY = 'y'
    process.env.CACTUS_LOGS_LEVEL = 'trace'
    const config = importFresh('config')
    importFresh('..')
    expect(config.get('logs.pretty')).to.equal(true)
    expect(config.get('logs.level')).to.equal('trace')
  })

  describe('logs.pretty', function () {
    it('should handle non boolean pretty values', function () {
      process.env.CACTUS_LOGS_PRETTY = 'd'
      const config = importFresh('config')
      importFresh('..')
      expect(config.get('logs.pretty')).to.equal(false)
    })
  })

  describe('logs.level', function () {
    it('should coerce level values', function () {
      process.env.CACTUS_LOGS_LEVEL = 'd'
      const config = importFresh('config')
      importFresh('..')
      expect(config.get('logs.level')).to.equal('info')
    })

    it('should accept non lowercase level values', function () {
      process.env.CACTUS_LOGS_LEVEL = 'DEBUG'
      const config = importFresh('config')
      importFresh('..')
      expect(config.get('logs.level')).to.equal('debug')
    })

    it('should accept all known level values', function () {
      testValue('fatal')
      testValue('error')
      testValue('warn')
      testValue('info')
      testValue('debug')
      testValue('trace')

      function testValue (value) {
        process.env.CACTUS_LOGS_LEVEL = value
        const config = importFresh('config')
        importFresh('..')
        expect(config.get('logs.level'), value).to.equal(value)
      }
    })
  })
})
