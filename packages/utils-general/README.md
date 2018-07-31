<!--@h1([pkg.name])-->

# @cactus-technologies/utils

<!--/@-->

<!--@pkg.description-->

Utility functions for node base apps

<!--/@-->

<!--@installation()-->

## Installation

```sh
npm install --save @cactus-technologies/utils
```

<!--/@-->

<a name="module_@cactus-technologies/utils"></a>

## @cactus-technologies/utils

-   [@cactus-technologies/utils](#module_@cactus-technologies/utils)

        * [.promisify(fn)](#module_@cactus-technologies/utils.promisify)

        * [.readFile(filePath, [options])](#module_@cactus-technologies/utils.readFile)

        * [.writeFile(filePath, data, [options])](#module_@cactus-technologies/utils.writeFile)

        * [.deleteFile(filePath)](#module_@cactus-technologies/utils.deleteFile)

        * ~~[.format()](#module_@cactus-technologies/utils.format)

    \~~

        * _Async helpers_
            * [.makeRetryable(fn, [opts])](#module_@cactus-technologies/utils.makeRetryable)

            * [.retry(fn, [opts])](#module_@cactus-technologies/utils.retry)

            * [.forever(fn)](#module_@cactus-technologies/utils.forever)

        * _Child Process_
            * [.exec(command, [args], [options])](#module_@cactus-technologies/utils.exec)

        * _Crypto_
            * [.encrypt(decrypted, encryptionKey)](#module_@cactus-technologies/utils.encrypt)

            * [.decrypt(encrypted, decryptionKey)](#module_@cactus-technologies/utils.decrypt)

            * [.hash(input)](#module_@cactus-technologies/utils.hash)

        * _File system_
            * [.rm](#module_@cactus-technologies/utils.rm)

            * [.exists(path)](#module_@cactus-technologies/utils.exists)

            * [.mkd(path)](#module_@cactus-technologies/utils.mkd)

            * [.readJson(filePath)](#module_@cactus-technologies/utils.readJson)

            * [.writeJson(filepath, data, [options])](#module_@cactus-technologies/utils.writeJson)

            * ~~[.saveFile()](#module_@cactus-technologies/utils.saveFile)

    \~~

            * ~~[.saveJson()](#module_@cactus-technologies/utils.saveJson)

    \~~

        * _Humanizers_
            * [.getDuration(start)](#module_@cactus-technologies/utils.getDuration)

            * [.humanizeStatusCode(status)](#module_@cactus-technologies/utils.humanizeStatusCode)

            * [.cleanUrl(url)](#module_@cactus-technologies/utils.cleanUrl)

        * _Object Utils_
            * [.extend(mergeInto, ...mergeFrom)](#module_@cactus-technologies/utils.extend)

            * [.diff(objA, objB)](#module_@cactus-technologies/utils.diff)

            * [.clone(obj)](#module_@cactus-technologies/utils.clone)

        * _Promise Chains_
            * [.tap](#module_@cactus-technologies/utils.tap)

            * [.forEach(coll, iteratee)](#module_@cactus-technologies/utils.forEach)

            * [.forEachSeries(coll, iteratee)](#module_@cactus-technologies/utils.forEachSeries)

            * [.forEachLimit(coll, limit, iteratee)](#module_@cactus-technologies/utils.forEachLimit)

            * [.map(coll, iteratee)](#module_@cactus-technologies/utils.map)

            * [.mapSeries(coll, iteratee)](#module_@cactus-technologies/utils.mapSeries)

            * [.mapLimit(coll, limit, iteratee)](#module_@cactus-technologies/utils.mapLimit)

            * [.mapValues(obj, iteratee)](#module_@cactus-technologies/utils.mapValues)

            * [.pipe(...fn)](#module_@cactus-technologies/utils.pipe)

        * _Promised Timers_
            * [.wait([ms])](#module_@cactus-technologies/utils.wait)

            * [.nextTick()](#module_@cactus-technologies/utils.nextTick)

<a name="module_@cactus-technologies/utils.promisify"></a>

### _utils_.promisify(fn)

| Param | Type                  | Description               |
| ----- | --------------------- | ------------------------- |
| fn    | <code>function</code> | Function to be converted. |

Takes a function following the common error-first callback style, i.e.
taking an `(err, value) => ... callback` as the last argument, and
returns a version that returns promises.

<a name="module_@cactus-technologies/utils.readFile"></a>

### _utils_.readFile(filePath, [options])

| Param     | Type                | Description            |
| --------- | ------------------- | ---------------------- |
| filePath  | <code>String</code> | Where to save the data |
| [options] | <code>Object</code> |                        |

Asynchronously reads data to from a file

Just a promisified version of fs.readFile

<a name="module_@cactus-technologies/utils.writeFile"></a>

### _utils_.writeFile(filePath, data, [options])

| Param     | Type                                       | Description            |
| --------- | ------------------------------------------ | ---------------------- |
| filePath  | <code>String</code>                        | Where to save the data |
| data      | <code>String</code> \| <code>Buffer</code> | Data to be saved       |
| [options] | <code>Object</code>                        |                        |

Asynchronously writes data to a file, replacing the file if it already
exists. data can be a string or a buffer. The Promise will be resolved
with no arguments upon success.

Just a promisified version of fs.writeFile

<a name="module_@cactus-technologies/utils.deleteFile"></a>

### _utils_.deleteFile(filePath)

| Param    | Type                | Description        |
| -------- | ------------------- | ------------------ |
| filePath | <code>String</code> | the file to delete |

Asynchronous unlink(2). The Promise is resolved with no arguments upon success.

Just a promisified version of fs.unlink

<a name="module_@cactus-technologies/utils.format"></a>

### ~~_utils_.format()~~

**_Deprecated_**

**See**: [util.format](https://nodejs.org/api/util.html#util_util_format_format_args) from the native Node Docs.  
<a name="module_@cactus-technologies/utils.makeRetryable"></a>

### _utils_.makeRetryable(fn, [opts])

**Category**: Async helpers

| Param  | Type                  | Default        | Description                                     |
| ------ | --------------------- | -------------- | ----------------------------------------------- |
| fn     | <code>function</code> |                | Async function to be wrapped.                   |
| [opts] | <code>Number</code>   | <code>5</code> | The number of attempts to make before giving up |

A close relative of retry. This method wraps a task and makes it retryable,
rather than immediately calling it with retries.

<a name="module_@cactus-technologies/utils.retry"></a>

### _utils_.retry(fn, [opts])

**Category**: Async helpers

| Param  | Type                  | Default        | Description                                     |
| ------ | --------------------- | -------------- | ----------------------------------------------- |
| fn     | <code>function</code> |                | Async function or Callback Style taks           |
| [opts] | <code>Number</code>   | <code>5</code> | The number of attempts to make before giving up |

Attempts to get a successful response from task no more than times times
before returning an error. If the task is successful, the Promise will
return the result of the successful task. If all attempts fail, the
Promise will Throw

<a name="module_@cactus-technologies/utils.forever"></a>

### _utils_.forever(fn)

**Category**: Async helpers

| Param | Type                  | Description                          |
| ----- | --------------------- | ------------------------------------ |
| fn    | <code>function</code> | an async function to call repeatedly |

Calls the asynchronous function in series, indefinitely. If the function
throws the execution will stop.

<a name="module_@cactus-technologies/utils.exec"></a>

### _utils_.exec(command, [args], [options])

**Category**: Child Process  
**See**: [execa](https://github.com/sindresorhus/execa#readme) for details

| Param                 | Type                                                  | Default                    | Description                                                                                                                                                                            |
| --------------------- | ----------------------------------------------------- | -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| command               | <code>String</code>                                   |                            |                                                                                                                                                                                        |
| [args]                | <code>Array</code> \| <code>String</code>             | <code>\[]</code>           | Either an Array of arguments or a String with the arguments.                                                                                                                           |
| [options]             | <code>Object</code>                                   |                            |                                                                                                                                                                                        |
| [options.cwd]         | <code>String</code>                                   | <code>process.cwd()</code> | Current working directory of the child process.                                                                                                                                        |
| [options.env]         | <code>Object</code>                                   | <code>process.env</code>   | Environment key-value pairs. Extends automatically from `process.env`                                                                                                                  |
| [options.extendEnv]   | <code>Boolean</code>                                  | <code>true</code>          | Set to false if you don't want to extend the environment variables when providing the env property.                                                                                    |
| [options.argv0]       | <code>String</code>                                   |                            | Explicitly set the value of `argv[0]`                                                                                                                                                  |
| [options.stdio]       | <code>String</code> \| <code>Array.&lt;String></code> | <code>pipe</code>          | Child's stdio configuration.                                                                                                                                                           |
| [options.detached]    | <code>Boolean</code>                                  | <code>false</code>         | Prepare child to run independently of its parent process.                                                                                                                              |
| [options.shell]       | <code>Boolean</code>                                  | <code>false</code>         | If `true`, runs command inside of a shell. Uses `/bin/sh` on `UNIX` and `cmd.exe` on `Windows`.                                                                                        |
| [options.preferLocal] | <code>Boolean</code>                                  | <code>true</code>          | Prefer locally installed binaries when looking for a binary to execute. If you `npm install foo`, you can then `utils.exec('foo')`.                                                    |
| [options.localDir]    | <code>String</code>                                   | <code>process.cwd()</code> | Preferred path to find locally installed binaries in (use with `preferLocal`).                                                                                                         |
| [options.input]       | <code>String</code>                                   |                            | Write some input to the `stdin` of your binary.                                                                                                                                        |
| [options.reject]      | <code>Boolean</code>                                  | <code>true</code>          | Setting this to `false` resolves the promise with the error instead of rejecting it.                                                                                                   |
| [options.cleanup]     | <code>Boolean</code>                                  | <code>true</code>          | Keep track of the spawned process and `kill` it when the parent process exits.                                                                                                         |
| [options.timeout]     | <code>Boolean</code>                                  | <code>0</code>             | If timeout is greater than `0`, the parent will send the signal identified by the `killSignal` property (the default is `SIGTERM`) if the child runs longer than timeout milliseconds. |
| [options.killSignal]  | <code>String</code>                                   | <code>SIGTERM</code>       | Signal value to be used when the spawned process will be killed.                                                                                                                       |

A better child_process:

-   Promise interface.
-   Strips EOF from the output so you don't have to `stdout.trim()`.
-   Supports shebang binaries cross-platform.
-   Higher max buffer. 10 MB instead of 200 KB.
-   Executes locally installed binaries by name. (from `node_modules`)
-   Cleans up spawned processes when the parent process dies.

**Returns**: <code>Promise</code> - Returns a child_process instance, which is enhanced to
also be a Promise for a result Object with stdout and stderr properties.  
**Example**

```js
;(async () => {
    const result = await utils.exec(
        'omxplayer',
        '~/color-factory/assets/videoFile'
    )
})()
```

**Example**

```js
;(async () => {
    const outputPath = '~/color-factory/assets/videoFile'
    try {
        await utils.exec('ffmpeg', [
            '-i',
            inputPath,
            '-vf',
            `crop=${crop}:${crop}:${startX}:${startY}`,
            outputPath
        ])
        return outputPath
    } catch (err) {
        log.error(err)
        throw err
    }
})()
```

<a name="module_@cactus-technologies/utils.encrypt"></a>

### _utils_.encrypt(decrypted, encryptionKey)

**Category**: Crypto

| Param         | Type                |
| ------------- | ------------------- |
| decrypted     | <code>String</code> |
| encryptionKey | <code>String</code> |

Encrypts the given String using the aes192 algorithm.

<a name="module_@cactus-technologies/utils.decrypt"></a>

### _utils_.decrypt(encrypted, decryptionKey)

**Category**: Crypto

| Param         | Type                |
| ------------- | ------------------- |
| encrypted     | <code>String</code> |
| decryptionKey | <code>String</code> |

Decrypts the given String using the aes192 algorithm.

<a name="module_@cactus-technologies/utils.hash"></a>

### _utils_.hash(input)

**Category**: Crypto

| Param | Type                                       | Description             |
| ----- | ------------------------------------------ | ----------------------- |
| input | <code>String</code> \| <code>Object</code> | The object to be hashed |

Creates a hash for file revving.

**Returns**: <code>String</code> - an MD5 hash truncated to 10 characters  
<a name="module_@cactus-technologies/utils.rm"></a>

### _utils_.rm

**Category**: File system  
**See**: [minimatch](https://github.com/isaacs/minimatch#usage) usage for patterns examples

| Param           | Type                                      | Default            | Description                    |
| --------------- | ----------------------------------------- | ------------------ | ------------------------------ |
| patterns        | <code>String</code> \| <code>Array</code> |                    | Path, or globs to be deleted   |
| [options]       | <code>Object</code>                       |                    | Options                        |
| [options.force] | <code>Object</code>                       | <code>false</code> | Allow deleting outside the cwd |

Delete files and folders using globs, It also protects you against deleting
the current working directory and above. - Think `rm -rf`.

<a name="module_@cactus-technologies/utils.exists"></a>

### _utils_.exists(path)

**Category**: File system

| Param | Type                | Description           |
| ----- | ------------------- | --------------------- |
| path  | <code>String</code> | Location to be tested |

Returns true if the path exists, false otherwise.

<a name="module_@cactus-technologies/utils.mkd"></a>

### _utils_.mkd(path)

**Category**: File system  
**Author**: sindresorhus@gmail.com

| Param | Type                | Description          |
| ----- | ------------------- | -------------------- |
| path  | <code>String</code> | Directory to create. |

Make a directory and its parents if needed - Think`mkdir -p`.

**Returns**: <code>Promise</code> - Promise for the path to the created directory.  
<a name="module_@cactus-technologies/utils.readJson"></a>

### _utils_.readJson(filePath)

**Category**: File system

| Param    | Type                |
| -------- | ------------------- |
| filePath | <code>String</code> |

Read and parse a JSON file. Strips UTF-8 BOM, uses graceful-fs, and throws
more helpful JSON errors.

Sync Version is also available under: `utils.readJson.sync`

**Returns**: <code>Promise</code> - Returns a promise for the parsed JSON.  
<a name="module_@cactus-technologies/utils.writeJson"></a>

### _utils_.writeJson(filepath, data, [options])

**Category**: File system

| Param                  | Type                                       | Default            | Description                                                                        |
| ---------------------- | ------------------------------------------ | ------------------ | ---------------------------------------------------------------------------------- |
| filepath               | <code>String</code>                        |                    | Where to save the data                                                             |
| data                   | <code>Object</code>                        |                    | Data to be saved                                                                   |
| [options]              | <code>Object</code>                        |                    |                                                                                    |
| [options.indent]       | <code>String</code> \| <code>Number</code> | <code>'\\t'</code> | Indentation as a `string` or `number` of spaces. Pass in `null` for no formatting. |
| [options.detectIndent] | <code>Boolean</code>                       | <code>false</code> | Detect indentation automatically if the file exists.                               |
| [options.sortKeys]     | <code>Boolean</code>                       | <code>false</code> | Sort the keys recursively.                                                         |
| [options.replace]      | <code>function</code>                      |                    | Passed into `JSON.stringify`.                                                      |

Stringify and write JSON to a file atomically, Creates directories for you
as needed.

Sync Version is also available under: `utils.writeJson.sync`

**Example**

```js
// Promise mode.
utils.writeJson('foo.json', { foo: true }).then(() => console.log('done'))
```

**Example**

```js
// async/await mode.
;async () => {
    await utils.writeJson('foo.json', { foo: true })
    console.log('done')
}
```

**Example**

```js
// Sync mode. (THIS BLOCKS THE EVENT LOOP)
utils.writeJson.sync('foo.json', { foo: true })
console.log('done')
```

<a name="module_@cactus-technologies/utils.saveFile"></a>

### ~~_utils_.saveFile()~~

**_Deprecated_**

**Category**: File system  
**See**: [utils.writeFile](utils.writeFile)  
<a name="module_@cactus-technologies/utils.saveJson"></a>

### ~~_utils_.saveJson()~~

**_Deprecated_**

**Category**: File system  
**See**: [utils.writeJson](utils.writeJson)  
<a name="module_@cactus-technologies/utils.getDuration"></a>

### _utils_.getDuration(start)

**Category**: Humanizers

| Param | Type                | Description                  |
| ----- | ------------------- | ---------------------------- |
| start | <code>Object</code> | A result of process.hrtime() |

Gets the duration in milliseconds from the given start time.

<a name="module_@cactus-technologies/utils.humanizeStatusCode"></a>

### _utils_.humanizeStatusCode(status)

**Category**: Humanizers

| Param  | Type                |
| ------ | ------------------- |
| status | <code>Number</code> |

Humanizes the given status code

<a name="module_@cactus-technologies/utils.cleanUrl"></a>

### _utils_.cleanUrl(url)

**Category**: Humanizers

| Param | Type                |
| ----- | ------------------- |
| url   | <code>String</code> |

Returns the path part of the given url

<a name="module_@cactus-technologies/utils.extend"></a>

### _utils_.extend(mergeInto, ...mergeFrom)

**Category**: Object Utils

| Param        | Type                | Description                                |
| ------------ | ------------------- | ------------------------------------------ |
| mergeInto    | <code>Object</code> | The object to merge into. ({} recommended) |
| ...mergeFrom | <code>Object</code> | Any number of objects to merge from        |

Extend an object (and any object it contains) with one or more objects (and
objects contained in them). This does not replace deep objects as other
extend functions do, but dives into them extending individual elements
instead.

**Returns**: <code>Object</code> - The altered mergeInto object is returned  
<a name="module_@cactus-technologies/utils.diff"></a>

### _utils_.diff(objA, objB)

**Category**: Object Utils

| Param | Type                | Description                |
| ----- | ------------------- | -------------------------- |
| objA  | <code>Object</code> | The object to compare from |
| objB  | <code>Object</code> | The object to compare with |

Returns an object containing all elements that differ between two objects.

**Returns**: <code>Object</code> - A differential object, which if extended onto objA would result in objB.  
<a name="module_@cactus-technologies/utils.clone"></a>

### _utils_.clone(obj)

**Category**: Object Utils

| Param | Type                | Description                      |
| ----- | ------------------- | -------------------------------- |
| obj   | <code>Object</code> | The original object to copy from |

This returns a new object with all elements copied from the specified
object. Deep copies are made of objects and arrays so you can do anything
with the returned object without affecting the input object.

**Returns**: <code>Object</code> - A new object with the elements copied from the copyFrom object  
<a name="module_@cactus-technologies/utils.tap"></a>

### _utils_.tap

**Category**: Promise Chains

| Param | Type                  | Description                   |
| ----- | --------------------- | ----------------------------- |
| input | <code>function</code> | Async function to be wrapped. |

Tap into a promise chain without affecting its value or state

**Returns**: <code>Promise</code> - An observer `corutine`.  
**Example**

```js
Promise.resolve('unicorn')
    .then(utils.tap(console.log)) // Logs `unicorn`
    .then(value => { // `value` is still `unicorn` })
```

<a name="module_@cactus-technologies/utils.forEach"></a>

### _utils_.forEach(coll, iteratee)

**Category**: Promise Chains

| Param    | Type                                      | Description                                     |
| -------- | ----------------------------------------- | ----------------------------------------------- |
| coll     | <code>Array</code> \| <code>Object</code> | A collection to iterate over.                   |
| iteratee | <code>function</code>                     | An async function to apply to each item in coll |

Array.forEach in parallel

<a name="module_@cactus-technologies/utils.forEachSeries"></a>

### _utils_.forEachSeries(coll, iteratee)

**Category**: Promise Chains

| Param    | Type                                      | Description                                     |
| -------- | ----------------------------------------- | ----------------------------------------------- |
| coll     | <code>Array</code> \| <code>Object</code> | A collection to iterate over.                   |
| iteratee | <code>function</code>                     | An async function to apply to each item in coll |

Array.forEach in series

<a name="module_@cactus-technologies/utils.forEachLimit"></a>

### _utils_.forEachLimit(coll, limit, iteratee)

**Category**: Promise Chains

| Param    | Type                                      | Description                                       |
| -------- | ----------------------------------------- | ------------------------------------------------- |
| coll     | <code>Array</code> \| <code>Object</code> | A collection to iterate over.                     |
| limit    | <code>Number</code>                       | The maximum number of async operations at a time. |
| iteratee | <code>function</code>                     | An async function to apply to each item in coll   |

Array.forEach in parallel with a concurrency limit

<a name="module_@cactus-technologies/utils.map"></a>

### _utils_.map(coll, iteratee)

**Category**: Promise Chains

| Param    | Type                                      | Description                                     |
| -------- | ----------------------------------------- | ----------------------------------------------- |
| coll     | <code>Array</code> \| <code>Object</code> | A collection to iterate over.                   |
| iteratee | <code>function</code>                     | An async function to apply to each item in coll |

Array.map in parallel

<a name="module_@cactus-technologies/utils.mapSeries"></a>

### _utils_.mapSeries(coll, iteratee)

**Category**: Promise Chains

| Param    | Type                                      | Description                                     |
| -------- | ----------------------------------------- | ----------------------------------------------- |
| coll     | <code>Array</code> \| <code>Object</code> | A collection to iterate over.                   |
| iteratee | <code>function</code>                     | An async function to apply to each item in coll |

Array.map in series

<a name="module_@cactus-technologies/utils.mapLimit"></a>

### _utils_.mapLimit(coll, limit, iteratee)

**Category**: Promise Chains

| Param    | Type                                      | Description                                       |
| -------- | ----------------------------------------- | ------------------------------------------------- |
| coll     | <code>Array</code> \| <code>Object</code> | A collection to iterate over.                     |
| limit    | <code>Number</code>                       | The maximum number of async operations at a time. |
| iteratee | <code>function</code>                     | An async function to apply to each item in coll   |

Array.map in parallel with a concurrency limit

<a name="module_@cactus-technologies/utils.mapValues"></a>

### _utils_.mapValues(obj, iteratee)

**Category**: Promise Chains

| Param    | Type                  | Description                                                                                                                                                 |
| -------- | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| obj      | <code>Object</code>   | A collection to iterate over.                                                                                                                               |
| iteratee | <code>function</code> | An Async function to apply to each `value` in `obj`. The iteratee should return the transformed value as its result. Invoked with `(value, key, callback)`. |

Relative of `utils.map`, designed for use with `objects`. Produces a new
Object by mapping each `value` of `obj` through the `iteratee function`.

<a name="module_@cactus-technologies/utils.pipe"></a>

### _utils_.pipe(...fn)

**Category**: Promise Chains

| Param | Type                  | Description                                                                             |
| ----- | --------------------- | --------------------------------------------------------------------------------------- |
| ...fn | <code>function</code> | Any number of Async Functions where each consumes the return value of the previous one. |

Creates a Promise that returns the result of invoking the given Async
Functions, where each successive invocation is supplied the return value
of the previous. ALA fp.pipe but for async functions.

<a name="module_@cactus-technologies/utils.wait"></a>

### _utils_.wait([ms])

**Category**: Promised Timers

| Param | Type                | Default           | Description         |
| ----- | ------------------- | ----------------- | ------------------- |
| [ms]  | <code>Number</code> | <code>1000</code> | Miliseconds to wait |

Will resolve the promise after the given miliseconds.

<a name="module_@cactus-technologies/utils.nextTick"></a>

### _utils_.nextTick()

**Category**: Promised Timers  
Promisified version of process.nextTick

<!--@license()-->

## License

[UNLICENCED](./LICENSE) © [Cactus Technologies, LLC](https://www.cactus.is)

<!--/@-->

## TODOs

### TODOs

| Filename | line # | TODO                                           |
| :------- | :----: | :--------------------------------------------- |
| index.js |   6    | Propper attributions                           |
| index.js |   70   | Detect and use the native promisified versions |
