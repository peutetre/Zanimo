# vendor-prefix [![Build Status](https://secure.travis-ci.org/peutetre/vendor-prefix.png)](http://travis-ci.org/peutetre/vendor-prefix) [![Mocha Saucelabs Tests Status](https://saucelabs.com/buildstatus/vendor-prefix)](https://saucelabs.com/u/vendor-prefix)

  add a vendor prefix to a css attribute

This is a fork from https://github.com/jkroso/prefix which is a fork of https://github.com/pgherveou/prefix

## Usage

    $ npm install vendor-prefix

```js
var prefix = require('vendor-prefix');
```

## API

### prefix(key)

  Prefix `key`. This function memoizes its results so you don't need to worry about any performance issues, just treat it like a map.

```js
prefix('transform'); // webkitTransform
prefix('color'); // color
```

Throw an error if the given string is not a css property.

### dash(key)

  create a dasherize version of a vendor prefix

```js
prefix.dash('transform'); // -webkit-transform
prefix.dash('color'); // color
prefix.dash('background-color'); // background-color
```

Throw an error if the given string is not a css property.

## Run the tests

    $ npm install
    $ npm run build

<a href="https://saucelabs.com/u/vendor-prefix">
  <img src="https://saucelabs.com/browser-matrix/vendor-prefix.svg" alt="Selenium Tests Status" />
</a>

open a browser at `test/index.html`
