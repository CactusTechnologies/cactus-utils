<!-- TITLE/ -->

<h1>@cactus-technologies/uuid</h1>

<!-- /TITLE -->

<!-- DESCRIPTION/ -->

A set of Unique ID generators for JS apps

<!-- /DESCRIPTION -->

<!-- INSTALL/ -->

<h2>Install</h2>

<a href="https://npmjs.com" title="npm is a package manager for javascript"><h3>NPM</h3></a><ul>

<li>Install: <code>npm install --save @cactus-technologies/uuid</code></li>
<li>Module: <code>require('@cactus-technologies/uuid')</code></li></ul>

<!-- /INSTALL -->

<a name="module_@cactus-technologies/uuid"></a>

## @cactus-technologies/uuid

A set of Unique ID generators

-   [@cactus-technologies/uuid](#module_@cactus-technologies/uuid)
    -   [.v4()](#module_@cactus-technologies/uuid.v4) ⇒ <code>String</code>
    -   [.hex(length)](#module_@cactus-technologies/uuid.hex) ⇒ <code>String</code>
    -   [.numeric(digits)](#module_@cactus-technologies/uuid.numeric) ⇒ <code>String</code>
    -   [.timeStamp()](#module_@cactus-technologies/uuid.timeStamp) ⇒ <code>String</code>
    -   [.shortStamp()](#module_@cactus-technologies/uuid.shortStamp) ⇒ <code>String</code>
    -   [.pokemon([hex])](#module_@cactus-technologies/uuid.pokemon) ⇒ <code>String</code>
    -   [.heroku()](#module_@cactus-technologies/uuid.heroku) ⇒ <code>String</code>
    -   [.humanized(words)](#module_@cactus-technologies/uuid.humanized) ⇒ <code>String</code>

<a name="module_@cactus-technologies/uuid.v4"></a>

### @cactus-technologies/uuid.v4() ⇒ <code>String</code>

Creates a 'UUID4 Random String'

**Kind**: static method of [<code>@cactus-technologies/uuid</code>](#module_@cactus-technologies/uuid)  
<a name="module_@cactus-technologies/uuid.hex"></a>

### @cactus-technologies/uuid.hex(length) ⇒ <code>String</code>

Produce a random string comprised of numbers or the characters ABCDEF of
length 'length'

**Kind**: static method of [<code>@cactus-technologies/uuid</code>](#module_@cactus-technologies/uuid)  
**Returns**: <code>String</code> - Hex String

| Param  | Type                | Description              |
| ------ | ------------------- | ------------------------ |
| length | <code>Number</code> | Length of the Hex String |

<a name="module_@cactus-technologies/uuid.numeric"></a>

### @cactus-technologies/uuid.numeric(digits) ⇒ <code>String</code>

Creates a 'Numeric Random String' with the last digit being used as a
CheckDigit using the Damn algorithm.

**Kind**: static method of [<code>@cactus-technologies/uuid</code>](#module_@cactus-technologies/uuid)  
**Returns**: <code>String</code> - Numeric Random String

| Param  | Type                | Description                |
| ------ | ------------------- | -------------------------- |
| digits | <code>Number</code> | Requested amount of digits |

<a name="module_@cactus-technologies/uuid.timeStamp"></a>

### @cactus-technologies/uuid.timeStamp() ⇒ <code>String</code>

Returns the number of milliseconds since the Unix Epoch. Appatently is called
["TimeValue"](https://www.ecma-international.org/ecma-262/6.0/#sec-time-values-and-time-range)

**Kind**: static method of [<code>@cactus-technologies/uuid</code>](#module_@cactus-technologies/uuid)  
<a name="module_@cactus-technologies/uuid.shortStamp"></a>

### @cactus-technologies/uuid.shortStamp() ⇒ <code>String</code>

Outputs a Unix Timestamp (the number of seconds since the Unix Epoch).

**Kind**: static method of [<code>@cactus-technologies/uuid</code>](#module_@cactus-technologies/uuid)  
<a name="module_@cactus-technologies/uuid.pokemon"></a>

### @cactus-technologies/uuid.pokemon([hex]) ⇒ <code>String</code>

Outputs a Random Pokemon Name, ONLY FROM THE ORIGINAL 151

**Kind**: static method of [<code>@cactus-technologies/uuid</code>](#module_@cactus-technologies/uuid)  
**Returns**: <code>String</code> - Pokemon Name

| Param | Type                 | Default           | Description                             |
| ----- | -------------------- | ----------------- | --------------------------------------- |
| [hex] | <code>Boolean</code> | <code>true</code> | Append a random Hex for extra randomess |

<a name="module_@cactus-technologies/uuid.heroku"></a>

### @cactus-technologies/uuid.heroku() ⇒ <code>String</code>

Generate Heroku-like random names

**Kind**: static method of [<code>@cactus-technologies/uuid</code>](#module_@cactus-technologies/uuid)  
<a name="module_@cactus-technologies/uuid.humanized"></a>

### @cactus-technologies/uuid.humanized(words) ⇒ <code>String</code>

Generates a Humanized String delimited by '.'

**Kind**: static method of [<code>@cactus-technologies/uuid</code>](#module_@cactus-technologies/uuid)  
**Returns**: <code>String</code> - Humanized String

| Param | Type                | Description     |
| ----- | ------------------- | --------------- |
| words | <code>Number</code> | How many words. |

<!-- LICENSE/ -->

<h2>License</h2>

Unless stated otherwise all works are:

<ul><li>Copyright &copy; <a href="http://www.cactus.is">Cactus Technologies LLC</a></li></ul>

and licensed under:

<ul><li><a href="http://spdx.org/licenses/MIT.html">MIT License</a></li></ul>

<!-- /LICENSE -->

+++

### TODOs

| Filename | line # | TODO |
| :------- | :----: | :--- |

