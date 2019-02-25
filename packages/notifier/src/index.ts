/*!
 * Copyright 2019 Cactus Technologies, LLC. All rights reserved.
 */

/**
 * @copyright Cactus Technologies, LLC. 2019
 * @file Creates and configures a slack notifier
 */

// import logger from '@cactus-technologies/logger'
// tslint:disable-next-line: match-default-export-name
import config from 'config'
// import got from 'got'
// import fp from 'lodash/fp'
// import moment from 'moment-timezone'
import path from 'path'
import util from 'util'
// import ms from 'pretty-ms'

// ─────────────────────────────  Load Defaults  ───────────────────────────────

/* Load the default configuration */
const configDir = path.resolve(__dirname, '..', 'config')
const defaultConfig = config.util.loadFileConfigs(configDir)
config.util.setModuleDefaults('slack', defaultConfig)

// ─────────────────────────────────  Init  ────────────────────────────────────

class Notifier {
  active: boolean
  private hook: string | null

  private enabled: boolean
  constructor() {
    this.hook = config.has('slack.hook') ? config.get('slack.hook') : null
    this.enabled = config.get('slack.enable')
    this.active = this.enabled && !!this.hook
  }

  [util.inspect.custom]() {
    return {
      active: this.active,
      hook: this.hook
        ? this.hook.replace('https://hooks.slack.com/services/', '')
        : this.hook
    }
  }
}
const instance = new Notifier()
export = instance
