const fp = require('lodash/fp')
const { WError } = require('verror')

class Lab100Error extends WError {
  constructor (opts, ...props) {
    super({ strict: true, ...opts }, ...props)
    this.name = 'Lab100Error'
    this.code = 'UNKNOWN'
    this.status = 500
  }

  asResponseError () {
    return {
      message: this.message,
      type: this.name,
      code: this.code,
      errors: this.errors || this.info || {}
    }
  }
}

exports.Lab100Error = Lab100Error

exports.InternalServerError = class InternalServerError extends Lab100Error {
  constructor (reason, ...props) {
    let cause

    if (fp.isError(reason)) {
      cause = reason
      props.unshift(reason.message)
    } else {
      props.unshift(reason)
    }

    if (props.length === 1) props.unshift('Error: %s')
    if (props.length === 0) props.unshift('InternalServerError')
    super({ cause: cause, constructorOpt: InternalServerError }, ...props)
    this.name = 'InternalServerError'
  }
}

exports.NotAuthorizedError = class NotAuthorizedError extends Lab100Error {
  constructor (...props) {
    if (props.length === 0) props.unshift('Not Authorized.')
    super({ constructorOpt: NotAuthorizedError }, ...props)
    this.name = 'NotAuthorizedError'
    this.code = 'ENOTAUTH'
    this.status = 401
  }
}

exports.NotFoundError = class NotFoundError extends Lab100Error {
  constructor (...props) {
    if (props.length === 0) props.unshift('Not Found.')
    if (props.length === 1) props.unshift('Not Found: %s.')
    super({ constructorOpt: NotFoundError }, ...props)
    this.name = 'NotFoundError'
    this.code = 'ENOTFOUND'
    this.status = 404
  }
}

exports.NotImplementedError = class NotImplementedError extends Lab100Error {
  constructor (...props) {
    if (props.length === 0) props.unshift('Not Implemented.')
    if (props.length === 1) props.unshift('Not Implemented: %s.')
    super({ constructorOpt: NotImplementedError }, ...props)
    this.name = 'NotFoundError'
    this.code = 'ENOTIMPLEMENTED'
    this.status = 501
  }
}

exports.InvalidArgumentError = exports.ArgError = class InvalidArgumentError extends Lab100Error {
  constructor (reason, ...props) {
    let cause
    if (!fp.isError(reason)) props = [reason, ...props]
    if (fp.isError(reason)) cause = reason
    if (props.length === 1) props.unshift('Invalid %s data.')
    if (props.length === 0) props.unshift('Invalid Input')
    super({ cause: cause, constructorOpt: InvalidArgumentError }, ...props)
    this.name = 'InvalidArgumentError'
    this.code = 'ERR_BAD_ARG_VALUE'
    this.status = 400
  }
}

exports.EmptyArgumentError = exports.EmptyArgError = class EmptyArgumentError extends Lab100Error {
  constructor (...props) {
    if (props.length === 1) props.unshift('%s is required.')
    if (props.length === 0) props.unshift('No Data provided.')
    super({ constructorOpt: EmptyArgumentError }, ...props)
    this.name = 'EmptyArgumentError'
    this.code = 'ERR_EMPTY_ARG_VALUE'
    this.status = 400
  }
}

exports.DatabaseValidationError = class DatabaseValidationError extends Lab100Error {
  constructor (cause) {
    const humanized = getHumanizedPairs(cause)
    const errors = getErrors(cause)
    const opts = {
      cause: cause,
      constructorOpt: DatabaseValidationError,
      info: errors
    }
    const props =
      humanized.length === 0
        ? ['Invalid Input']
        : humanized.length === 1
          ? [getFirstReason(humanized)]
          : ['Invalid %s.', getErrorsPaths(humanized)]

    super(opts, ...props)

    this.name = 'InvalidArgumentError'
    this.code = 'ERR_INVALID_ARG_VALUE'
    this.status = 400
    this.errors = errors

    function getErrors (error) {
      return fp.pipe([
        fp.getOr({}, 'errors'),
        fp.mapValues(fp.get('message')),
        fp.omit(getNested(error)),
        fp.toPairs,
        fp.reduce((acc, current) => fp.set(...current, acc), {})
      ])(error)
    }

    function getHumanizedPairs (error) {
      return fp.pipe([
        fp.getOr({}, 'errors'),
        fp.mapValues(fp.get('message')),
        fp.omit(getNested(error)),
        fp.mapKeys(fp.pipe([fp.split('.'), fp.last, fp.startCase])),
        fp.toPairs
      ])(error)
    }

    function getNested (error) {
      return fp.pipe([
        fp.getOr({}, 'errors'),
        fp.toPairs,
        fp.map(fp.first),
        fp.filter(k => k.split('.').length > 1),
        fp.map(fp.pipe([fp.split('.'), fp.initial, fp.join('.')]))
      ])(error)
    }

    function getErrorsPaths (errors) {
      const reasons = fp.map(fp.first)(errors)
      const output = []
      while (reasons.length > 2) {
        output.push(reasons.shift())
      }
      output.push(reasons.join(' and '))
      return output.join(', ')
    }

    function getFirstReason (errors) {
      return fp.last(fp.first(errors))
    }
  }
}

exports.DatabaseSaveError = class DatabaseSaveError extends Lab100Error {
  constructor (cause, doc) {
    const props = [
      'Cannot save the %s (%s: %s) in the Database.',
      fp.getOr('Document', 'constructor.modelName', doc),
      doc.mrn ? 'mrn' : doc.uuid ? 'uuid' : 'id',
      doc.mrn || doc.uuid || doc.id || doc._id
    ]

    super({ cause: cause, constructorOpt: DatabaseSaveError }, ...props)

    this.name = 'DatabaseSaveError'
    this.code = 'ERR_DATABASE_SAVE'
  }
}

exports.DatabaseRemoveError = class DatabaseRemoveError extends Lab100Error {
  constructor (cause, doc) {
    const props = [
      'Cannot remove the %s (%s: %s) in the Database.',
      fp.getOr('Document', 'constructor.modelName', doc),
      doc.mrn ? 'mrn' : doc.uuid ? 'uuid' : 'id',
      doc.mrn || doc.uuid || doc.id || doc._id
    ]

    super({ cause: cause, constructorOpt: DatabaseRemoveError }, ...props)

    this.name = 'DatabaseSaveError'
    this.code = 'ERR_DATABASE_REMOVE'
  }
}

exports.DatabaseNotFoundError = class DatabaseNotFoundError extends Lab100Error {
  constructor (query, modelName = 'Document', status = 404, ...props) {
    if (props.length === 0) {
      props.unshift('Cannot find a {modelName} matching the query.')
    }
    props[0] = props[0].replace('{modelName}', modelName)
    props.push(
      query.mrn ||
        query.uuid ||
        query._id ||
        query.code ||
        JSON.stringify(query)
    )

    super({ constructorOpt: DatabaseNotFoundError, info: query }, ...props)

    this.name = 'DatabaseNotFoundError'
    this.code = `ENOT${fp.toUpper(modelName)}`
    this.status = status
  }
}

exports.MissingDependencyError = class MissingDependencyError extends Lab100Error {
  constructor (reason, ...props) {
    if (props.length === 1) {
      props.unshift('Cannot find a valid executable in the PATH')
    }
    if (props.length === 0) {
      props.unshift('Cannot find a %s executable in the PATH')
    }

    super({ cause: reason, constructorOpt: MissingDependencyError }, ...props)

    this.name = 'MissingDependencyError'
    this.code = 'ENOPKG'
    this.status = 500
  }
}

exports.FileNotFoundError = class FileNotFoundError extends Lab100Error {
  constructor (reason, ...props) {
    if (props.length === 1) {
      props.unshift('Cannot find the file %s in the FileSystem')
    }
    if (props.length === 0) {
      props.unshift('Cannot find the file in the FileSystem')
    }

    super({ cause: reason, constructorOpt: FileNotFoundError }, ...props)

    this.name = 'FileNotFoundError'
    this.code = 'ENOENT'
    this.status = 500
  }
}

exports.PhoneNotRegisteredError = class PhoneNotRegisteredError extends Lab100Error {
  constructor (...props) {
    if (props.length === 1) {
      props.unshift('The phone %s is not registered.')
    }
    if (props.length === 0) {
      props.unshift('The phone is not registered.')
    }

    super({ constructorOpt: PhoneNotRegisteredError }, ...props)

    this.name = 'PhoneNotRegistered'
    this.code = 'ENOTUSER'
    this.status = 202
  }
}
