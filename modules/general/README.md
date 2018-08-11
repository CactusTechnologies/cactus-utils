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

**Example**

```js
const utils = require('@cactus-technologies/utils')
```

-   [@cactus-technologies/utils](#module_@cactus-technologies/utils)
    -   [.assert](#module_@cactus-technologies/utils.assert) : <code>object</code>
        -   _Date Validation_
            -   [.isBeforeToday(entry)](#module_@cactus-technologies/utils.assert.isBeforeToday) ⇒ <code>Boolean</code>
            -   [.isBefore(entry, \[date\])](#module_@cactus-technologies/utils.assert.isBefore) ⇒ <code>Boolean</code>
            -   [.isAfter(entry, \[date\])](#module_@cactus-technologies/utils.assert.isAfter) ⇒ <code>Boolean</code>
        -   _FileSystem Validation_
            -   [.exists(path)](#module_@cactus-technologies/utils.assert.exists) ⇒ <code>Boolean</code>
        -   _Integrity Validation_
            -   [.checkDigit(input)](#module_@cactus-technologies/utils.assert.checkDigit) ⇒ <code>Boolean</code>
        -   _Negated Validation_
            -   ~~[.notDate](#module_@cactus-technologies/utils.assert.notDate) ⇒ <code>Boolean</code>~~
            -   [.notNil(entry)](#module_@cactus-technologies/utils.assert.notNil) ⇒ <code>Boolean</code>
            -   [.notEmpty(entry)](#module_@cactus-technologies/utils.assert.notEmpty) ⇒ <code>Boolean</code>
            -   [.notValidDate(entry)](#module_@cactus-technologies/utils.assert.notValidDate) ⇒ <code>Boolean</code>
            -   [.notOkStatus(entry)](#module_@cactus-technologies/utils.assert.notOkStatus) ⇒ <code>Boolean</code>
        -   _Validation_
            -   ~~[.isDate](#module_@cactus-technologies/utils.assert.isDate) ⇒ <code>Boolean</code>~~
            -   ~~[.inEnumeration](#module_@cactus-technologies/utils.assert.inEnumeration) ⇒ <code>function</code>~~
            -   [.isNil(entry)](#module_@cactus-technologies/utils.assert.isNil) ⇒ <code>Boolean</code>
            -   [.isEmpty(entry)](#module_@cactus-technologies/utils.assert.isEmpty) ⇒ <code>Boolean</code>
            -   [.isNumber(entry)](#module_@cactus-technologies/utils.assert.isNumber) ⇒ <code>Boolean</code>
            -   [.isString(entry)](#module_@cactus-technologies/utils.assert.isString) ⇒ <code>Boolean</code>
            -   [.isEmail(entry)](#module_@cactus-technologies/utils.assert.isEmail) ⇒ <code>Boolean</code>
            -   [.isCreditCard(entry)](#module_@cactus-technologies/utils.assert.isCreditCard) ⇒ <code>Boolean</code>
            -   [.isFunction(entry)](#module_@cactus-technologies/utils.assert.isFunction) ⇒ <code>Boolean</code>
            -   [.isObject(entry)](#module_@cactus-technologies/utils.assert.isObject) ⇒ <code>Boolean</code>
            -   [.isArray(entry)](#module_@cactus-technologies/utils.assert.isArray) ⇒ <code>Boolean</code>
            -   [.isValidDate(entry)](#module_@cactus-technologies/utils.assert.isValidDate) ⇒ <code>Boolean</code>
            -   [.isOkStatus(entry)](#module_@cactus-technologies/utils.assert.isOkStatus) ⇒ <code>Boolean</code>
            -   [.isIn(values)](#module_@cactus-technologies/utils.assert.isIn) ⇒ <code>function</code>
    -   [.normalize](#module_@cactus-technologies/utils.normalize) : <code>object</code>
        -   [.day(input)](#module_@cactus-technologies/utils.normalize.day) ⇒ <code>String</code>
        -   [.email(input)](#module_@cactus-technologies/utils.normalize.email) ⇒ <code>String</code>
        -   [.statusCode(status)](#module_@cactus-technologies/utils.normalize.statusCode) ⇒ <code>Number</code>
        -   [.string(input)](#module_@cactus-technologies/utils.normalize.string) ⇒ <code>String</code>
        -   [.header(input)](#module_@cactus-technologies/utils.normalize.header) ⇒ <code>String</code>
    -   [.promisify(fn)](#module_@cactus-technologies/utils.promisify) ⇒ <code>Promise</code>
    -   ~~[.exists()](#module_@cactus-technologies/utils.exists)~~
    -   ~~[.format()](#module_@cactus-technologies/utils.format)~~
    -   _Async helpers_
        -   [.makeRetryable(fn, \[opts\])](#module_@cactus-technologies/utils.makeRetryable) ⇒ <code>Promise</code>
        -   [.retry(fn, \[opts\])](#module_@cactus-technologies/utils.retry) ⇒ <code>Promise</code>
        -   [.forever(fn)](#module_@cactus-technologies/utils.forever) ⇒ <code>Promise</code>
    -   _Child Process_
        -   [.exec(command, \[args\], \[options\])](#module_@cactus-technologies/utils.exec) ⇒ <code>Promise</code>
        -   [.shell(command, \[options\])](#module_@cactus-technologies/utils.shell) ⇒ <code>Promise</code>
    -   _Crypto_
        -   [.encrypt(decrypted, encryptionKey)](#module_@cactus-technologies/utils.encrypt) ⇒ <code>String</code>
        -   [.decrypt(encrypted, decryptionKey)](#module_@cactus-technologies/utils.decrypt) ⇒ <code>String</code>
        -   [.hash(input)](#module_@cactus-technologies/utils.hash) ⇒ <code>String</code>
    -   _File system_
        -   [.rm](#module_@cactus-technologies/utils.rm) ⇒ <code>Promise</code>
        -   [.mkd(path)](#module_@cactus-technologies/utils.mkd) ⇒ <code>Promise</code>
        -   [.readFile(filePath, \[options\])](#module_@cactus-technologies/utils.readFile) ⇒ <code>Promise</code>
        -   [.writeFile(filePath, data, \[opts\])](#module_@cactus-technologies/utils.writeFile) ⇒ <code>Promise</code>
        -   [.deleteFile(filePath)](#module_@cactus-technologies/utils.deleteFile) ⇒ <code>Promise</code>
        -   [.readJson(filePath)](#module_@cactus-technologies/utils.readJson) ⇒ <code>Promise</code>
        -   [.writeJson(filepath, data, \[options\])](#module_@cactus-technologies/utils.writeJson) ⇒ <code>Promise</code>
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
        -   [.sortKeys(obj, \[sortWith\])](#module_@cactus-technologies/utils.sortKeys) ⇒ <code>Object</code>
    -   _Promise Chains_
        -   [.tap](#module_@cactus-technologies/utils.tap) ⇒ <code>Promise</code>
        -   [.forEach(coll, iteratee)](#module_@cactus-technologies/utils.forEach) ⇒ <code>Promise</code>
        -   [.forEachSeries(coll, iteratee)](#module_@cactus-technologies/utils.forEachSeries) ⇒ <code>Promise</code>
        -   [.forEachLimit(coll, limit, iteratee)](#module_@cactus-technologies/utils.forEachLimit) ⇒ <code>Promise</code>
        -   [.map(coll, iteratee)](#module_@cactus-technologies/utils.map) ⇒ <code>Promise</code>
        -   [.mapSeries(coll, iteratee)](#module_@cactus-technologies/utils.mapSeries) ⇒ <code>Promise</code>
        -   [.mapLimit(coll, limit, iteratee)](#module_@cactus-technologies/utils.mapLimit) ⇒ <code>Promise</code>
        -   [.mapValues(obj, iteratee)](#module_@cactus-technologies/utils.mapValues) ⇒ <code>Promise</code>
        -   [.pipe(...fn)](#module_@cactus-technologies/utils.pipe) ⇒ <code>Promise</code>
    -   _Promised Timers_
        -   [.wait(\[ms\])](#module_@cactus-technologies/utils.wait) ⇒ <code>Promise</code>
        -   [.nextTick()](#module_@cactus-technologies/utils.nextTick) ⇒ <code>Promise</code>

<a name="module_@cactus-technologies/utils.assert"></a>

### utils.assert : <code>object</code>

Assert functions for quick validations.

**Kind**: static namespace of [<code>@cactus-technologies/utils</code>](#module_@cactus-technologies/utils)

-   [.assert](#module_@cactus-technologies/utils.assert) : <code>object</code>
    -   _Date Validation_
        -   [.isBeforeToday(entry)](#module_@cactus-technologies/utils.assert.isBeforeToday) ⇒ <code>Boolean</code>
        -   [.isBefore(entry, \[date\])](#module_@cactus-technologies/utils.assert.isBefore) ⇒ <code>Boolean</code>
        -   [.isAfter(entry, \[date\])](#module_@cactus-technologies/utils.assert.isAfter) ⇒ <code>Boolean</code>
    -   _FileSystem Validation_
        -   [.exists(path)](#module_@cactus-technologies/utils.assert.exists) ⇒ <code>Boolean</code>
    -   _Integrity Validation_
        -   [.checkDigit(input)](#module_@cactus-technologies/utils.assert.checkDigit) ⇒ <code>Boolean</code>
    -   _Negated Validation_
        -   ~~[.notDate](#module_@cactus-technologies/utils.assert.notDate) ⇒ <code>Boolean</code>~~
        -   [.notNil(entry)](#module_@cactus-technologies/utils.assert.notNil) ⇒ <code>Boolean</code>
        -   [.notEmpty(entry)](#module_@cactus-technologies/utils.assert.notEmpty) ⇒ <code>Boolean</code>
        -   [.notValidDate(entry)](#module_@cactus-technologies/utils.assert.notValidDate) ⇒ <code>Boolean</code>
        -   [.notOkStatus(entry)](#module_@cactus-technologies/utils.assert.notOkStatus) ⇒ <code>Boolean</code>
    -   _Validation_
        -   ~~[.isDate](#module_@cactus-technologies/utils.assert.isDate) ⇒ <code>Boolean</code>~~
        -   ~~[.inEnumeration](#module_@cactus-technologies/utils.assert.inEnumeration) ⇒ <code>function</code>~~
        -   [.isNil(entry)](#module_@cactus-technologies/utils.assert.isNil) ⇒ <code>Boolean</code>
        -   [.isEmpty(entry)](#module_@cactus-technologies/utils.assert.isEmpty) ⇒ <code>Boolean</code>
        -   [.isNumber(entry)](#module_@cactus-technologies/utils.assert.isNumber) ⇒ <code>Boolean</code>
        -   [.isString(entry)](#module_@cactus-technologies/utils.assert.isString) ⇒ <code>Boolean</code>
        -   [.isEmail(entry)](#module_@cactus-technologies/utils.assert.isEmail) ⇒ <code>Boolean</code>
        -   [.isCreditCard(entry)](#module_@cactus-technologies/utils.assert.isCreditCard) ⇒ <code>Boolean</code>
        -   [.isFunction(entry)](#module_@cactus-technologies/utils.assert.isFunction) ⇒ <code>Boolean</code>
        -   [.isObject(entry)](#module_@cactus-technologies/utils.assert.isObject) ⇒ <code>Boolean</code>
        -   [.isArray(entry)](#module_@cactus-technologies/utils.assert.isArray) ⇒ <code>Boolean</code>
        -   [.isValidDate(entry)](#module_@cactus-technologies/utils.assert.isValidDate) ⇒ <code>Boolean</code>
        -   [.isOkStatus(entry)](#module_@cactus-technologies/utils.assert.isOkStatus) ⇒ <code>Boolean</code>
        -   [.isIn(values)](#module_@cactus-technologies/utils.assert.isIn) ⇒ <code>function</code>

<a name="module_@cactus-technologies/utils.assert.isBeforeToday"></a>

#### assert.isBeforeToday(entry) ⇒ <code>Boolean</code>

Returns `true` if the value is a valid Date and the date is before today.
(day precision)

**Kind**: static method of [<code>assert</code>](#module_@cactus-technologies/utils.assert)  
**Category**: Date Validation

| Param | Type            | Description    |
| ----- | --------------- | -------------- |
| entry | <code>\*</code> | Value to Check |

<a name="module_@cactus-technologies/utils.assert.isBefore"></a>

#### assert.isBefore(entry, [date]) ⇒ <code>Boolean</code>

Returns `true` if the value is a valid Date and the date is before the given
one. (ms presicion)

**Kind**: static method of [<code>assert</code>](#module_@cactus-technologies/utils.assert)  
**Category**: Date Validation

| Param  | Type                                     | Default                 | Description          |
| ------ | ---------------------------------------- | ----------------------- | -------------------- |
| entry  | <code>\*</code>                          |                         | Value to Check       |
| [date] | <code>String</code> \| <code>Date</code> | <code>Date.now()</code> | Date to test against |

<a name="module_@cactus-technologies/utils.assert.isAfter"></a>

#### assert.isAfter(entry, [date]) ⇒ <code>Boolean</code>

Returns `true` if the value is a valid Date and the date is after the given
one. (ms presicion)

**Kind**: static method of [<code>assert</code>](#module_@cactus-technologies/utils.assert)  
**Category**: Date Validation

| Param  | Type                                     | Default                 | Description          |
| ------ | ---------------------------------------- | ----------------------- | -------------------- |
| entry  | <code>\*</code>                          |                         | Value to Check       |
| [date] | <code>String</code> \| <code>Date</code> | <code>Date.now()</code> | Date to test against |

<a name="module_@cactus-technologies/utils.assert.exists"></a>

#### assert.exists(path) ⇒ <code>Boolean</code>

Returns `true` if the path exists, false otherwise.

**Kind**: static method of [<code>assert</code>](#module_@cactus-technologies/utils.assert)  
**Category**: FileSystem Validation

| Param | Type                | Description           |
| ----- | ------------------- | --------------------- |
| path  | <code>String</code> | Location to be tested |

<a name="module_@cactus-technologies/utils.assert.checkDigit"></a>

#### assert.checkDigit(input) ⇒ <code>Boolean</code>

Checks if the given input string against the Damm algorithm

**Kind**: static method of [<code>assert</code>](#module_@cactus-technologies/utils.assert)  
**Category**: Integrity Validation

| Param | Type                | Description                               |
| ----- | ------------------- | ----------------------------------------- |
| input | <code>String</code> | Numeric String, probs from uuid.numeric() |

<a name="module_@cactus-technologies/utils.assert.notDate"></a>

#### ~~assert.notDate ⇒ <code>Boolean</code>~~

**_Deprecated_**

Returns `true` if the value is not a valid Date

**Kind**: static property of [<code>assert</code>](#module_@cactus-technologies/utils.assert)  
**Category**: Negated Validation

| Param | Type            | Description    |
| ----- | --------------- | -------------- |
| entry | <code>\*</code> | Value to Check |

<a name="module_@cactus-technologies/utils.assert.notNil"></a>

#### assert.notNil(entry) ⇒ <code>Boolean</code>

Returns `true` if the value is not 'undefined' or 'null'

**Kind**: static method of [<code>assert</code>](#module_@cactus-technologies/utils.assert)  
**Category**: Negated Validation

| Param | Type            | Description    |
| ----- | --------------- | -------------- |
| entry | <code>\*</code> | Value to Check |

<a name="module_@cactus-technologies/utils.assert.notEmpty"></a>

#### assert.notEmpty(entry) ⇒ <code>Boolean</code>

Returns `true` if the value is not empty

**Kind**: static method of [<code>assert</code>](#module_@cactus-technologies/utils.assert)  
**Category**: Negated Validation

| Param | Type            | Description    |
| ----- | --------------- | -------------- |
| entry | <code>\*</code> | Value to Check |

<a name="module_@cactus-technologies/utils.assert.notValidDate"></a>

#### assert.notValidDate(entry) ⇒ <code>Boolean</code>

Returns `true` if the value is not a valid Date

**Kind**: static method of [<code>assert</code>](#module_@cactus-technologies/utils.assert)  
**Category**: Negated Validation

| Param | Type            | Description    |
| ----- | --------------- | -------------- |
| entry | <code>\*</code> | Value to Check |

<a name="module_@cactus-technologies/utils.assert.notOkStatus"></a>

#### assert.notOkStatus(entry) ⇒ <code>Boolean</code>

Returns `true` if the value is not a valid status code (>= 200 &lt; 400)

**Kind**: static method of [<code>assert</code>](#module_@cactus-technologies/utils.assert)  
**Category**: Negated Validation

| Param | Type            | Description    |
| ----- | --------------- | -------------- |
| entry | <code>\*</code> | Value to Check |

<a name="module_@cactus-technologies/utils.assert.isDate"></a>

#### ~~assert.isDate ⇒ <code>Boolean</code>~~

**_Deprecated_**

Returns `true` if the value is a valid Date

**Kind**: static property of [<code>assert</code>](#module_@cactus-technologies/utils.assert)  
**Category**: Validation

| Param | Type            | Description    |
| ----- | --------------- | -------------- |
| entry | <code>\*</code> | Value to Check |

<a name="module_@cactus-technologies/utils.assert.inEnumeration"></a>

#### ~~assert.inEnumeration ⇒ <code>function</code>~~

**_Deprecated_**

Returns A function that will return `true` if the given entry exist ins the given array

**Kind**: static property of [<code>assert</code>](#module_@cactus-technologies/utils.assert)  
**Category**: Validation

| Param  | Type               | Description    |
| ------ | ------------------ | -------------- |
| values | <code>Array</code> | Array to Check |

<a name="module_@cactus-technologies/utils.assert.isNil"></a>

#### assert.isNil(entry) ⇒ <code>Boolean</code>

Returns `true` if the value is undefined' or 'null'

**Kind**: static method of [<code>assert</code>](#module_@cactus-technologies/utils.assert)  
**Category**: Validation

| Param | Type            | Description    |
| ----- | --------------- | -------------- |
| entry | <code>\*</code> | Value to Check |

<a name="module_@cactus-technologies/utils.assert.isEmpty"></a>

#### assert.isEmpty(entry) ⇒ <code>Boolean</code>

Returns `true` if the value is 'empty'

**Kind**: static method of [<code>assert</code>](#module_@cactus-technologies/utils.assert)  
**Category**: Validation

| Param | Type            | Description    |
| ----- | --------------- | -------------- |
| entry | <code>\*</code> | Value to Check |

<a name="module_@cactus-technologies/utils.assert.isNumber"></a>

#### assert.isNumber(entry) ⇒ <code>Boolean</code>

Returns `true` if the value is a number or can be casted as one. `Infinite`
and `NaN` are consider `false`

**Kind**: static method of [<code>assert</code>](#module_@cactus-technologies/utils.assert)  
**Category**: Validation

| Param | Type            | Description    |
| ----- | --------------- | -------------- |
| entry | <code>\*</code> | Value to Check |

<a name="module_@cactus-technologies/utils.assert.isString"></a>

#### assert.isString(entry) ⇒ <code>Boolean</code>

Returns `true` if the value is a String

**Kind**: static method of [<code>assert</code>](#module_@cactus-technologies/utils.assert)  
**Category**: Validation

| Param | Type            | Description    |
| ----- | --------------- | -------------- |
| entry | <code>\*</code> | Value to Check |

<a name="module_@cactus-technologies/utils.assert.isEmail"></a>

#### assert.isEmail(entry) ⇒ <code>Boolean</code>

Returns `true` if the value is a valid phone Email address

**Kind**: static method of [<code>assert</code>](#module_@cactus-technologies/utils.assert)  
**Category**: Validation

| Param | Type                | Description    |
| ----- | ------------------- | -------------- |
| entry | <code>String</code> | Value to Check |

<a name="module_@cactus-technologies/utils.assert.isCreditCard"></a>

#### assert.isCreditCard(entry) ⇒ <code>Boolean</code>

Returns `true` if the value is a valid CreditCard

**Kind**: static method of [<code>assert</code>](#module_@cactus-technologies/utils.assert)  
**Category**: Validation

| Param | Type            | Description    |
| ----- | --------------- | -------------- |
| entry | <code>\*</code> | Value to Check |

<a name="module_@cactus-technologies/utils.assert.isFunction"></a>

#### assert.isFunction(entry) ⇒ <code>Boolean</code>

Returns `true` if the value is a function

**Kind**: static method of [<code>assert</code>](#module_@cactus-technologies/utils.assert)  
**Category**: Validation

| Param | Type            | Description    |
| ----- | --------------- | -------------- |
| entry | <code>\*</code> | Value to Check |

<a name="module_@cactus-technologies/utils.assert.isObject"></a>

#### assert.isObject(entry) ⇒ <code>Boolean</code>

Returns `true` if if value is a plain object, that is, an `object` created
by the `Object constructor` or one with a `[[Prototype]]` of `null`.

**Kind**: static method of [<code>assert</code>](#module_@cactus-technologies/utils.assert)  
**Category**: Validation

| Param | Type            | Description    |
| ----- | --------------- | -------------- |
| entry | <code>\*</code> | Value to Check |

<a name="module_@cactus-technologies/utils.assert.isArray"></a>

#### assert.isArray(entry) ⇒ <code>Boolean</code>

Returns `true` if if value is an `Array`

**Kind**: static method of [<code>assert</code>](#module_@cactus-technologies/utils.assert)  
**Category**: Validation

| Param | Type            | Description    |
| ----- | --------------- | -------------- |
| entry | <code>\*</code> | Value to Check |

<a name="module_@cactus-technologies/utils.assert.isValidDate"></a>

#### assert.isValidDate(entry) ⇒ <code>Boolean</code>

Returns `true` if the value is a valid Date

**Kind**: static method of [<code>assert</code>](#module_@cactus-technologies/utils.assert)  
**Category**: Validation

| Param | Type            | Description    |
| ----- | --------------- | -------------- |
| entry | <code>\*</code> | Value to Check |

<a name="module_@cactus-technologies/utils.assert.isOkStatus"></a>

#### assert.isOkStatus(entry) ⇒ <code>Boolean</code>

Returns `true` if the value is a valid status code (>= 200 &lt; 400)

**Kind**: static method of [<code>assert</code>](#module_@cactus-technologies/utils.assert)  
**Category**: Validation

| Param | Type                | Description    |
| ----- | ------------------- | -------------- |
| entry | <code>Number</code> | Value to Check |

<a name="module_@cactus-technologies/utils.assert.isIn"></a>

#### assert.isIn(values) ⇒ <code>function</code>

Returns A function that will return `true` if the given entry exist ins the given array

**Kind**: static method of [<code>assert</code>](#module_@cactus-technologies/utils.assert)  
**Category**: Validation

| Param  | Type               | Description    |
| ------ | ------------------ | -------------- |
| values | <code>Array</code> | Array to Check |

<a name="module_@cactus-technologies/utils.normalize"></a>

### utils.normalize : <code>object</code>

Normalize common data.

**Kind**: static namespace of [<code>@cactus-technologies/utils</code>](#module_@cactus-technologies/utils)

-   [.normalize](#module_@cactus-technologies/utils.normalize) : <code>object</code>
    -   [.day(input)](#module_@cactus-technologies/utils.normalize.day) ⇒ <code>String</code>
    -   [.email(input)](#module_@cactus-technologies/utils.normalize.email) ⇒ <code>String</code>
    -   [.statusCode(status)](#module_@cactus-technologies/utils.normalize.statusCode) ⇒ <code>Number</code>
    -   [.string(input)](#module_@cactus-technologies/utils.normalize.string) ⇒ <code>String</code>
    -   [.header(input)](#module_@cactus-technologies/utils.normalize.header) ⇒ <code>String</code>

<a name="module_@cactus-technologies/utils.normalize.day"></a>

#### normalize.day(input) ⇒ <code>String</code>

Normalizes the given date to the begining of the date. (This doesn't
validate that the input)

**Kind**: static method of [<code>normalize</code>](#module_@cactus-technologies/utils.normalize)  
**Returns**: <code>String</code> - ISO8601 date.

| Param | Type                                     |
| ----- | ---------------------------------------- |
| input | <code>String</code> \| <code>Date</code> |

<a name="module_@cactus-technologies/utils.normalize.email"></a>

#### normalize.email(input) ⇒ <code>String</code>

Normalizes an email address. (This doesn't validate that the input is an
email, if you want to validate the email use utils.validate.isEmail
beforehand)

**Kind**: static method of [<code>normalize</code>](#module_@cactus-technologies/utils.normalize)

| Param | Type                |
| ----- | ------------------- |
| input | <code>String</code> |

<a name="module_@cactus-technologies/utils.normalize.statusCode"></a>

#### normalize.statusCode(status) ⇒ <code>Number</code>

Normalizes an StatusCode.

**Kind**: static method of [<code>normalize</code>](#module_@cactus-technologies/utils.normalize)

| Param  | Type                |
| ------ | ------------------- |
| status | <code>Number</code> |

<a name="module_@cactus-technologies/utils.normalize.string"></a>

#### normalize.string(input) ⇒ <code>String</code>

Trims an String.

**Kind**: static method of [<code>normalize</code>](#module_@cactus-technologies/utils.normalize)

| Param | Type                |
| ----- | ------------------- |
| input | <code>String</code> |

<a name="module_@cactus-technologies/utils.normalize.header"></a>

#### normalize.header(input) ⇒ <code>String</code>

Transforms the string in to a Header Style one

**Kind**: static method of [<code>normalize</code>](#module_@cactus-technologies/utils.normalize)

| Param | Type                |
| ----- | ------------------- |
| input | <code>String</code> |

<a name="module_@cactus-technologies/utils.promisify"></a>

### utils.promisify(fn) ⇒ <code>Promise</code>

Takes a function following the common error-first callback style, i.e.
taking an `(err, value) => ... callback` as the last argument, and
returns a version that returns promises.

**Kind**: static method of [<code>@cactus-technologies/utils</code>](#module_@cactus-technologies/utils)

| Param | Type                  | Description               |
| ----- | --------------------- | ------------------------- |
| fn    | <code>function</code> | Function to be converted. |

<a name="module_@cactus-technologies/utils.exists"></a>

### ~~utils.exists()~~

**_Deprecated_**

**Kind**: static method of [<code>@cactus-technologies/utils</code>](#module_@cactus-technologies/utils)  
**See**: [utils.validate.exists](utils.validate.exists)  
<a name="module_@cactus-technologies/utils.format"></a>

### ~~utils.format()~~

**_Deprecated_**

**Kind**: static method of [<code>@cactus-technologies/utils</code>](#module_@cactus-technologies/utils)  
**See**: [util.format](https://nodejs.org/api/util.html#util_util_format_format_args) from the native Node Docs.  
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

<a name="module_@cactus-technologies/utils.exec"></a>

### utils.exec(command, [args], [options]) ⇒ <code>Promise</code>

A better child_process:

-   Promise interface.
-   Strips EOF from the output so you don't have to `stdout.trim()`.
-   Supports shebang binaries cross-platform.
-   Higher max buffer. 10 MB instead of 200 KB.
-   Executes locally installed binaries by name. (from `node_modules`)
-   Cleans up spawned processes when the parent process dies.

**Kind**: static method of [<code>@cactus-technologies/utils</code>](#module_@cactus-technologies/utils)  
**Returns**: <code>Promise</code> - Returns a child_process instance, which is enhanced to
also be a Promise for a result Object with stdout and stderr properties.  
**Category**: Child Process  
**See**: [execa](https://github.com/sindresorhus/execa#readme) for details

| Param                 | Type                                                  | Default                    | Description                                                                                                                                                                            |
| --------------------- | ----------------------------------------------------- | -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| command               | <code>String</code>                                   |                            |                                                                                                                                                                                        |
| [args]                | <code>Array</code>                                    | <code>\[]</code>           | Either an Array of arguments or a String with the arguments.                                                                                                                           |
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

**Example**

```js
;(async () => {
    const result = await utils.exec('omxplayer', [
        '~/color-factory/assets/videoFile'
    ])
})()
```

<a name="module_@cactus-technologies/utils.shell"></a>

### utils.shell(command, [options]) ⇒ <code>Promise</code>

A better child_process.exec:

**Kind**: static method of [<code>@cactus-technologies/utils</code>](#module_@cactus-technologies/utils)  
**Returns**: <code>Promise</code> - Returns a child_process instance, which is enhanced to
also be a Promise for a result Object with stdout and stderr properties.  
**Category**: Child Process  
**See**: [execa](https://github.com/sindresorhus/execa#readme) for details

| Param                 | Type                                                  | Default                    | Description                                                                                                                                                                            |
| --------------------- | ----------------------------------------------------- | -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| command               | <code>String</code>                                   |                            |                                                                                                                                                                                        |
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

<a name="module_@cactus-technologies/utils.rm"></a>

### utils.rm ⇒ <code>Promise</code>

Delete files and folders using globs, It also protects you against deleting
the current working directory and above. - Think `rm -rf`.

**Kind**: static property of [<code>@cactus-technologies/utils</code>](#module_@cactus-technologies/utils)  
**Category**: File system  
**See**: [minimatch](https://github.com/isaacs/minimatch#usage) usage for patterns examples

| Param           | Type                                      | Default            | Description                    |
| --------------- | ----------------------------------------- | ------------------ | ------------------------------ |
| patterns        | <code>String</code> \| <code>Array</code> |                    | Path, or globs to be deleted   |
| [options]       | <code>Object</code>                       |                    | Options                        |
| [options.force] | <code>Object</code>                       | <code>false</code> | Allow deleting outside the cwd |

<a name="module_@cactus-technologies/utils.mkd"></a>

### utils.mkd(path) ⇒ <code>Promise</code>

Make a directory and its parents if needed - Think`mkdir -p`.

**Kind**: static method of [<code>@cactus-technologies/utils</code>](#module_@cactus-technologies/utils)  
**Returns**: <code>Promise</code> - Promise for the path to the created directory.  
**Category**: File system  
**Author**: sindresorhus@gmail.com

| Param | Type                | Description          |
| ----- | ------------------- | -------------------- |
| path  | <code>String</code> | Directory to create. |

<a name="module_@cactus-technologies/utils.readFile"></a>

### utils.readFile(filePath, [options]) ⇒ <code>Promise</code>

Asynchronously reads data to from a file

Just a promisified version of fs.readFile

**Kind**: static method of [<code>@cactus-technologies/utils</code>](#module_@cactus-technologies/utils)  
**Category**: File system

| Param     | Type                | Description            |
| --------- | ------------------- | ---------------------- |
| filePath  | <code>String</code> | Where to save the data |
| [options] | <code>Object</code> |                        |

<a name="module_@cactus-technologies/utils.writeFile"></a>

### utils.writeFile(filePath, data, [opts]) ⇒ <code>Promise</code>

Athomically writes data to a file, replacing the file if it already
exists. Creates directories for you as needed.

Sync Version is also available under: `utils.writeFile.sync`

**Kind**: static method of [<code>@cactus-technologies/utils</code>](#module_@cactus-technologies/utils)  
**Category**: File system

| Param    | Type                                       | Description            |
| -------- | ------------------------------------------ | ---------------------- |
| filePath | <code>String</code>                        | Where to save the data |
| data     | <code>String</code> \| <code>Buffer</code> | Data to be saved       |
| [opts]   | <code>Object</code>                        |                        |

**Example**

```js
// Promise mode.
utils.writeFile('path/to/foo.jpg', imageData).then(() => console.log('done'))
```

**Example**

```js
// async/await mode.
;async () => {
    utils.writeFile('path/to/foo.jpg', imageData)
    console.log('done')
}
```

**Example**

```js
// Sync mode. (THIS BLOCKS THE EVENT LOOP)
utils.writeFile.sync('path/to/foo.jpg', imageData)
console.log('done')
```

<a name="module_@cactus-technologies/utils.deleteFile"></a>

### utils.deleteFile(filePath) ⇒ <code>Promise</code>

Asynchronous unlink(2). The Promise is resolved with no arguments upon success.

Just a promisified version of fs.unlink

**Kind**: static method of [<code>@cactus-technologies/utils</code>](#module_@cactus-technologies/utils)  
**Category**: File system

| Param    | Type                | Description        |
| -------- | ------------------- | ------------------ |
| filePath | <code>String</code> | the file to delete |

<a name="module_@cactus-technologies/utils.readJson"></a>

### utils.readJson(filePath) ⇒ <code>Promise</code>

Read and parse a JSON file. Strips UTF-8 BOM, uses graceful-fs, and throws
more helpful JSON errors.

Sync Version is also available under: `utils.readJson.sync`

**Kind**: static method of [<code>@cactus-technologies/utils</code>](#module_@cactus-technologies/utils)  
**Returns**: <code>Promise</code> - Returns a promise for the parsed JSON.  
**Category**: File system

| Param    | Type                |
| -------- | ------------------- |
| filePath | <code>String</code> |

<a name="module_@cactus-technologies/utils.writeJson"></a>

### utils.writeJson(filepath, data, [options]) ⇒ <code>Promise</code>

Stringify and write JSON to a file atomically, Creates directories for you
as needed.

Sync Version is also available under: `utils.writeJson.sync`

**Kind**: static method of [<code>@cactus-technologies/utils</code>](#module_@cactus-technologies/utils)  
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
**Returns**: <code>Object</code> - A differential object, which if extended onto objA would result in objB.  
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
**Returns**: <code>Object</code> - A new object with the elements copied from the copyFrom object  
**Category**: Object Utils

| Param | Type                | Description                      |
| ----- | ------------------- | -------------------------------- |
| obj   | <code>Object</code> | The original object to copy from |

<a name="module_@cactus-technologies/utils.sortKeys"></a>

### utils.sortKeys(obj, [sortWith]) ⇒ <code>Object</code>

Returns a copy of an object with all keys sorted.

**Kind**: static method of [<code>@cactus-technologies/utils</code>](#module_@cactus-technologies/utils)  
**Category**: Object Utils  
**Requires**: <code>module:sort-object-keys</code>  
**Author**: keithamus

| Param      | Type                                        | Description                                                                                         |
| ---------- | ------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| obj        | <code>Object</code>                         | The Object to sort.                                                                                 |
| [sortWith] | <code>Array</code> \| <code>function</code> | An `Array` containing ordered keys or a `Function` (same signature as in `Array.prototype.sort()`). |

<a name="module_@cactus-technologies/utils.tap"></a>

### utils.tap ⇒ <code>Promise</code>

Tap into a promise chain without affecting its value or state

**Kind**: static property of [<code>@cactus-technologies/utils</code>](#module_@cactus-technologies/utils)  
**Returns**: <code>Promise</code> - An observer `corutine`.  
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

<a name="module_@cactus-technologies/utils.forEach"></a>

### utils.forEach(coll, iteratee) ⇒ <code>Promise</code>

Array.forEach in parallel

**Kind**: static method of [<code>@cactus-technologies/utils</code>](#module_@cactus-technologies/utils)  
**Category**: Promise Chains

| Param    | Type                                      | Description                                     |
| -------- | ----------------------------------------- | ----------------------------------------------- |
| coll     | <code>Array</code> \| <code>Object</code> | A collection to iterate over.                   |
| iteratee | <code>function</code>                     | An async function to apply to each item in coll |

<a name="module_@cactus-technologies/utils.forEachSeries"></a>

### utils.forEachSeries(coll, iteratee) ⇒ <code>Promise</code>

Array.forEach in series

**Kind**: static method of [<code>@cactus-technologies/utils</code>](#module_@cactus-technologies/utils)  
**Category**: Promise Chains

| Param    | Type                                      | Description                                     |
| -------- | ----------------------------------------- | ----------------------------------------------- |
| coll     | <code>Array</code> \| <code>Object</code> | A collection to iterate over.                   |
| iteratee | <code>function</code>                     | An async function to apply to each item in coll |

<a name="module_@cactus-technologies/utils.forEachLimit"></a>

### utils.forEachLimit(coll, limit, iteratee) ⇒ <code>Promise</code>

Array.forEach in parallel with a concurrency limit

**Kind**: static method of [<code>@cactus-technologies/utils</code>](#module_@cactus-technologies/utils)  
**Category**: Promise Chains

| Param    | Type                                      | Description                                       |
| -------- | ----------------------------------------- | ------------------------------------------------- |
| coll     | <code>Array</code> \| <code>Object</code> | A collection to iterate over.                     |
| limit    | <code>Number</code>                       | The maximum number of async operations at a time. |
| iteratee | <code>function</code>                     | An async function to apply to each item in coll   |

<a name="module_@cactus-technologies/utils.map"></a>

### utils.map(coll, iteratee) ⇒ <code>Promise</code>

Array.map in parallel

**Kind**: static method of [<code>@cactus-technologies/utils</code>](#module_@cactus-technologies/utils)  
**Category**: Promise Chains

| Param    | Type                                      | Description                                     |
| -------- | ----------------------------------------- | ----------------------------------------------- |
| coll     | <code>Array</code> \| <code>Object</code> | A collection to iterate over.                   |
| iteratee | <code>function</code>                     | An async function to apply to each item in coll |

<a name="module_@cactus-technologies/utils.mapSeries"></a>

### utils.mapSeries(coll, iteratee) ⇒ <code>Promise</code>

Array.map in series

**Kind**: static method of [<code>@cactus-technologies/utils</code>](#module_@cactus-technologies/utils)  
**Category**: Promise Chains

| Param    | Type                                      | Description                                     |
| -------- | ----------------------------------------- | ----------------------------------------------- |
| coll     | <code>Array</code> \| <code>Object</code> | A collection to iterate over.                   |
| iteratee | <code>function</code>                     | An async function to apply to each item in coll |

<a name="module_@cactus-technologies/utils.mapLimit"></a>

### utils.mapLimit(coll, limit, iteratee) ⇒ <code>Promise</code>

Array.map in parallel with a concurrency limit

**Kind**: static method of [<code>@cactus-technologies/utils</code>](#module_@cactus-technologies/utils)  
**Category**: Promise Chains

| Param    | Type                                      | Description                                       |
| -------- | ----------------------------------------- | ------------------------------------------------- |
| coll     | <code>Array</code> \| <code>Object</code> | A collection to iterate over.                     |
| limit    | <code>Number</code>                       | The maximum number of async operations at a time. |
| iteratee | <code>function</code>                     | An async function to apply to each item in coll   |

<a name="module_@cactus-technologies/utils.mapValues"></a>

### utils.mapValues(obj, iteratee) ⇒ <code>Promise</code>

Relative of `utils.map`, designed for use with `objects`. Produces a new
Object by mapping each `value` of `obj` through the `iteratee function`.

**Kind**: static method of [<code>@cactus-technologies/utils</code>](#module_@cactus-technologies/utils)  
**Category**: Promise Chains

| Param    | Type                  | Description                                                                                                                                                 |
| -------- | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| obj      | <code>Object</code>   | A collection to iterate over.                                                                                                                               |
| iteratee | <code>function</code> | An Async function to apply to each `value` in `obj`. The iteratee should return the transformed value as its result. Invoked with `(value, key, callback)`. |

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
