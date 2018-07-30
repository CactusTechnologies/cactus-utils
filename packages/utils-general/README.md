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
    -   [.promisify(fn)](#module_@cactus-technologies/utils.promisify) ⇒ <code>Promise</code>
    -   [.say(str)](#module_@cactus-technologies/utils.say) ⇒ <code>Boolean</code>
    -   _Async helpers_
        -   [.makeRetryable(fn, \[opts\])](#module_@cactus-technologies/utils.makeRetryable) ⇒ <code>Promise</code>
        -   [.retry(fn, \[opts\])](#module_@cactus-technologies/utils.retry) ⇒ <code>Promise</code>
        -   [.forever(fn)](#module_@cactus-technologies/utils.forever) ⇒ <code>Promise</code>
    -   _Crypto_
        -   [.encrypt(decrypted, encryptionKey)](#module_@cactus-technologies/utils.encrypt) ⇒ <code>String</code>
        -   [.decrypt(encrypted, decryptionKey)](#module_@cactus-technologies/utils.decrypt) ⇒ <code>String</code>
        -   [.hash(input)](#module_@cactus-technologies/utils.hash) ⇒ <code>String</code>
    -   _File system_
        -   [.exists(path)](#module_@cactus-technologies/utils.exists) ⇒ <code>Boolean</code>
        -   [.mkd(path)](#module_@cactus-technologies/utils.mkd) ⇒ <code>Promise</code>
        -   [.rm(patterns, \[force\])](#module_@cactus-technologies/utils.rm) ⇒ <code>Promise</code>
        -   ~~[.format()](#module_@cactus-technologies/utils.format)~~
        -   ~~[.saveFile()](#module_@cactus-technologies/utils.saveFile)~~
        -   ~~[.saveJson()](#module_@cactus-technologies/utils.saveJson)~~
    -   _Humanizers_
        -   [.getDuration(start)](#module_@cactus-technologies/utils.getDuration) ⇒ <code>Number</code>
        -   [.humanizeStatusCode(status)](#module_@cactus-technologies/utils.humanizeStatusCode) ⇒ <code>String</code>
        -   [.cleanUrl(url)](#module_@cactus-technologies/utils.cleanUrl) ⇒ <code>String</code>
    -   _Object Utils_
        -   [.extend(mergeInto, ...mergeFrom)](#module_@cactus-technologies/utils.extend) ⇒ <code>Object</code>
        -   [.diff(objA, objB)](#module_@cactus-technologies/utils.diff) ⇒ <code>Object</code>
        -   [.clone(obj)](#module_@cactus-technologies/utils.clone) ⇒ <code>Object</code>
    -   _Promise Chains_
        -   [.tap](#module_@cactus-technologies/utils.tap) : <code>Promise</code>
        -   [.pipe(...fn)](#module_@cactus-technologies/utils.pipe) ⇒ <code>Promise</code>
    -   _Promised Timers_
        -   [.wait(\[ms\])](#module_@cactus-technologies/utils.wait) ⇒ <code>Promise</code>
        -   [.nextTick()](#module_@cactus-technologies/utils.nextTick) ⇒ <code>Promise</code>

<a name="module_@cactus-technologies/utils.promisify"></a>

### utils.promisify(fn) ⇒ <code>Promise</code>

Takes a function following the common error-first callback style, i.e.
taking an (err, value) => ... callback as the last argument, and returns
a version that returns promises.

**Kind**: static method of [<code>@cactus-technologies/utils</code>](#module_@cactus-technologies/utils)

| Param | Type                  | Description               |
| ----- | --------------------- | ------------------------- |
| fn    | <code>function</code> | Function to be converted. |

<a name="module_@cactus-technologies/utils.say"></a>

### utils.say(str) ⇒ <code>Boolean</code>

Uses the sepakers to anounce the given string. MacOs only

**Kind**: static method of [<code>@cactus-technologies/utils</code>](#module_@cactus-technologies/utils)

| Param | Type                | Description |
| ----- | ------------------- | ----------- |
| str   | <code>String</code> | What to say |

<a name="module_@cactus-technologies/utils.makeRetryable"></a>

### utils.makeRetryable(fn, [opts]) ⇒ <code>Promise</code>

A close relative of retry. This method wraps a task and makes it retryable,
rather than immediately calling it with retries.

**Kind**: static method of [<code>@cactus-technologies/utils</code>](#module_@cactus-technologies/utils)  
**Category**: Async helpers

| Param  | Type                  | Default        | Description                                     |
| ------ | --------------------- | -------------- | ----------------------------------------------- |
| fn     | <code>function</code> |                | Async function to be wrapped.                   |
| [opts] | <code>Number</code>   | <code>5</code> | The number of attempts to make before giving up |

<a name="module_@cactus-technologies/utils.retry"></a>

### utils.retry(fn, [opts]) ⇒ <code>Promise</code>

Attempts to get a successful response from task no more than times times
before returning an error. If the task is successful, the Promise will
return the result of the successful task. If all attempts fail, the
Promise will Throw

**Kind**: static method of [<code>@cactus-technologies/utils</code>](#module_@cactus-technologies/utils)  
**Category**: Async helpers

| Param  | Type                  | Default        | Description                                     |
| ------ | --------------------- | -------------- | ----------------------------------------------- |
| fn     | <code>function</code> |                | Async function or Callback Style taks           |
| [opts] | <code>Number</code>   | <code>5</code> | The number of attempts to make before giving up |

<a name="module_@cactus-technologies/utils.forever"></a>

### utils.forever(fn) ⇒ <code>Promise</code>

Calls the asynchronous function in series, indefinitely. If the function
throws the execution will stop.

**Kind**: static method of [<code>@cactus-technologies/utils</code>](#module_@cactus-technologies/utils)  
**Category**: Async helpers

| Param | Type                  | Description                          |
| ----- | --------------------- | ------------------------------------ |
| fn    | <code>function</code> | an async function to call repeatedly |

<a name="module_@cactus-technologies/utils.encrypt"></a>

### utils.encrypt(decrypted, encryptionKey) ⇒ <code>String</code>

Encrypts the given String using the aes192 algorithm.

**Kind**: static method of [<code>@cactus-technologies/utils</code>](#module_@cactus-technologies/utils)  
**Category**: Crypto

| Param         | Type                |
| ------------- | ------------------- |
| decrypted     | <code>String</code> |
| encryptionKey | <code>String</code> |

<a name="module_@cactus-technologies/utils.decrypt"></a>

### utils.decrypt(encrypted, decryptionKey) ⇒ <code>String</code>

Decrypts the given String using the aes192 algorithm.

**Kind**: static method of [<code>@cactus-technologies/utils</code>](#module_@cactus-technologies/utils)  
**Category**: Crypto

| Param         | Type                |
| ------------- | ------------------- |
| encrypted     | <code>String</code> |
| decryptionKey | <code>String</code> |

<a name="module_@cactus-technologies/utils.hash"></a>

### utils.hash(input) ⇒ <code>String</code>

Creates a hash for file revving.

**Kind**: static method of [<code>@cactus-technologies/utils</code>](#module_@cactus-technologies/utils)  
**Returns**: <code>String</code> - an MD5 hash truncated to 10 characters  
**Category**: Crypto

| Param | Type                                       | Description             |
| ----- | ------------------------------------------ | ----------------------- |
| input | <code>String</code> \| <code>Object</code> | The object to be hashed |

<a name="module_@cactus-technologies/utils.exists"></a>

### utils.exists(path) ⇒ <code>Boolean</code>

Returns true if the path exists, false otherwise.

**Kind**: static method of [<code>@cactus-technologies/utils</code>](#module_@cactus-technologies/utils)  
**Category**: File system

| Param | Type                | Description           |
| ----- | ------------------- | --------------------- |
| path  | <code>String</code> | Location to be tested |

<a name="module_@cactus-technologies/utils.mkd"></a>

### utils.mkd(path) ⇒ <code>Promise</code>

Make a directory and its parents if needed - Think mkdir -p. Returns a
Promise for the path to the created directory.

**Kind**: static method of [<code>@cactus-technologies/utils</code>](#module_@cactus-technologies/utils)  
**Category**: File system  
**Author**: sindresorhus@gmail.com

| Param | Type                | Description          |
| ----- | ------------------- | -------------------- |
| path  | <code>String</code> | Directory to create. |

<a name="module_@cactus-technologies/utils.rm"></a>

### utils.rm(patterns, [force]) ⇒ <code>Promise</code>

Delete files and folders using globs, It also protects you against deleting
the current working directory and above. - Think rm -rf.

**Kind**: static method of [<code>@cactus-technologies/utils</code>](#module_@cactus-technologies/utils)  
**Category**: File system  
**See**: [| minimatch](https://github.com/isaacs/minimatch#usage) usage
for patterns examples  
**Author**: sindresorhus@gmail.com

| Param    | Type                                      | Default            | Description                                               |
| -------- | ----------------------------------------- | ------------------ | --------------------------------------------------------- |
| patterns | <code>String</code> \| <code>Array</code> |                    | Path, or globs to be deleted                              |
| [force]  | <code>Boolean</code>                      | <code>false</code> | Allow deleting the current working directory and outside. |

<a name="module_@cactus-technologies/utils.format"></a>

### ~~utils.format()~~

**_Deprecated_**

**Kind**: static method of [<code>@cactus-technologies/utils</code>](#module_@cactus-technologies/utils)  
**Category**: File system  
**See**: [| util.format](https://nodejs.org/api/util.html#util_util_format_format_args) from the native Node Docs.  
<a name="module_@cactus-technologies/utils.saveFile"></a>

### ~~utils.saveFile()~~

**_Deprecated_**

**Kind**: static method of [<code>@cactus-technologies/utils</code>](#module_@cactus-technologies/utils)  
**Category**: File system  
**See**: [utils.writeFile](utils.writeFile)  
<a name="module_@cactus-technologies/utils.saveJson"></a>

### ~~utils.saveJson()~~

**_Deprecated_**

**Kind**: static method of [<code>@cactus-technologies/utils</code>](#module_@cactus-technologies/utils)  
**Category**: File system  
**See**: [utils.writeJson](utils.writeJson)  
<a name="module_@cactus-technologies/utils.getDuration"></a>

### utils.getDuration(start) ⇒ <code>Number</code>

Gets the duration in milliseconds from the given start time.

**Kind**: static method of [<code>@cactus-technologies/utils</code>](#module_@cactus-technologies/utils)  
**Category**: Humanizers

| Param | Type                | Description                  |
| ----- | ------------------- | ---------------------------- |
| start | <code>Object</code> | A result of process.hrtime() |

<a name="module_@cactus-technologies/utils.humanizeStatusCode"></a>

### utils.humanizeStatusCode(status) ⇒ <code>String</code>

Humanizes the given status code

**Kind**: static method of [<code>@cactus-technologies/utils</code>](#module_@cactus-technologies/utils)  
**Category**: Humanizers

| Param  | Type                |
| ------ | ------------------- |
| status | <code>Number</code> |

<a name="module_@cactus-technologies/utils.cleanUrl"></a>

### utils.cleanUrl(url) ⇒ <code>String</code>

Returns the path part of the given url

**Kind**: static method of [<code>@cactus-technologies/utils</code>](#module_@cactus-technologies/utils)  
**Category**: Humanizers

| Param | Type                |
| ----- | ------------------- |
| url   | <code>String</code> |

<a name="module_@cactus-technologies/utils.extend"></a>

### utils.extend(mergeInto, ...mergeFrom) ⇒ <code>Object</code>

Extend an object (and any object it contains) with one or more objects (and
objects contained in them). This does not replace deep objects as other
extend functions do, but dives into them extending individual elements
instead.

**Kind**: static method of [<code>@cactus-technologies/utils</code>](#module_@cactus-technologies/utils)  
**Returns**: <code>Object</code> - The altered mergeInto object is returned  
**Category**: Object Utils

| Param        | Type                | Description                                |
| ------------ | ------------------- | ------------------------------------------ |
| mergeInto    | <code>Object</code> | The object to merge into. ({} recommended) |
| ...mergeFrom | <code>Object</code> | Any number of objects to merge from        |

<a name="module_@cactus-technologies/utils.diff"></a>

### utils.diff(objA, objB) ⇒ <code>Object</code>

Returns an object containing all elements that differ between two objects.

**Kind**: static method of [<code>@cactus-technologies/utils</code>](#module_@cactus-technologies/utils)  
**Returns**: <code>Object</code> - A differential object, which if extended onto objA would
result in objB.  
**Category**: Object Utils

| Param | Type                | Description                |
| ----- | ------------------- | -------------------------- |
| objA  | <code>Object</code> | The object to compare from |
| objB  | <code>Object</code> | The object to compare with |

<a name="module_@cactus-technologies/utils.clone"></a>

### utils.clone(obj) ⇒ <code>Object</code>

This returns a new object with all elements copied from the specified
object. Deep copies are made of objects and arrays so you can do anything
with the returned object without affecting the input object.

**Kind**: static method of [<code>@cactus-technologies/utils</code>](#module_@cactus-technologies/utils)  
**Returns**: <code>Object</code> - A new object with the elements copied from the copyFrom
object  
**Category**: Object Utils

| Param | Type                | Description                      |
| ----- | ------------------- | -------------------------------- |
| obj   | <code>Object</code> | The original object to copy from |

<a name="module_@cactus-technologies/utils.tap"></a>

### utils.tap : <code>Promise</code>

Tap into a promise chain without affecting its value or state

**Kind**: static property of [<code>@cactus-technologies/utils</code>](#module_@cactus-technologies/utils)  
**Category**: Promise Chains

| Param | Type                  | Description                   |
| ----- | --------------------- | ----------------------------- |
| input | <code>function</code> | Async function to be wrapped. |

**Example**

```js
Promise.resolve('unicorn')
    .then(utils.tap(console.log)) // Logs `unicorn`
    .then(value => { // `value` is still `unicorn` })
```

<a name="module_@cactus-technologies/utils.pipe"></a>

### utils.pipe(...fn) ⇒ <code>Promise</code>

Creates a Promise that returns the result of invoking the given Async
Functions, where each successive invocation is supplied the return value
of the previous. ALA fp.pipe but for async functions.

**Kind**: static method of [<code>@cactus-technologies/utils</code>](#module_@cactus-technologies/utils)  
**Category**: Promise Chains

| Param | Type                  | Description                                                                             |
| ----- | --------------------- | --------------------------------------------------------------------------------------- |
| ...fn | <code>function</code> | Any number of Async Functions where each consumes the return value of the previous one. |

<a name="module_@cactus-technologies/utils.wait"></a>

### utils.wait([ms]) ⇒ <code>Promise</code>

Will resolve the promise after the given miliseconds.

**Kind**: static method of [<code>@cactus-technologies/utils</code>](#module_@cactus-technologies/utils)  
**Category**: Promised Timers

| Param | Type                | Default           | Description         |
| ----- | ------------------- | ----------------- | ------------------- |
| [ms]  | <code>Number</code> | <code>1000</code> | Miliseconds to wait |

<a name="module_@cactus-technologies/utils.nextTick"></a>

### utils.nextTick() ⇒ <code>Promise</code>

Promisified version of process.nextTick

**Kind**: static method of [<code>@cactus-technologies/utils</code>](#module_@cactus-technologies/utils)  
**Category**: Promised Timers

<!--@license()-->

## License

[UNLICENCED](./LICENSE) © [Cactus Technologies, LLC](https://www.cactus.is)

<!--/@-->
