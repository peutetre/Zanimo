# Zanimo.js - Promise based CSS3 transitions [![Build Status](https://secure.travis-ci.org/peutetre/Zanimo.png?branch=Q)](http://travis-ci.org/peutetre/Zanimo)

[![SauceLabs Status](https://saucelabs.com/browser-matrix/zanimo.svg)](https://saucelabs.com/u/zanimo)

Allows chaining of css transitions in a promise based way, which gives a powerful control over CSS transitions
for making animations.

Zanimo.js is licensed under the terms of the MIT License.

## Install

```sh
$ npm install zanimo
```

To use in the browser, compile with [browserify](http://browserify.org) or fetch
a UMD bundle from [browserify cdn](http://wzrd.in).

##  tests

Build tests with

```
npm run build
```

and open [test/index.html](http://peutetre.github.com/Zanimo/test/index.html) in your browser.

## API

### Zanimo(el | promise[el]) ➜  promise[el]

Takes a DOM element or a promise of a DOM element and returns a promise of the given element.

~~~ javascript
Zanimo(myDomElement).then(function (el) {
    // do something with the DOM element
}, function (reason) {
    // do something when `myDOMElement` isn't a DOM element
});
~~~


### Zanimo(el | promise[el], property, value) ➜  promise[el]

Applies a css style on the given DOM element.

~~~ javascript
Zanimo(myDomElement, "transform", "translate3d(200px, 200px, 0)")
    .then(function (domElt) { console.log("Done..."); });
~~~


### Zanimo(el | promise[el], property, value, duration, [easing])  ➜  promise[el]

Starts a transition on the given DOM element and returns a promise.
For now Zanimo does not support hexadecimal color notation or 0px (just use 0) in the value argument.

~~~ javascript
Zanimo(myDomElement, "width", "200px", 200, "ease-in")
    .then(
        function (domElt) { /* do something on success */ },
        function (reason) { /* do something on error */ }
    );
~~~

### Zanimo.f(*)  ➜  ( function(el) ➜  promise[el] )

Encapsulates a `Zanimo(el, *)` call by returning a function (el) ➜ promise[el].

Useful to define reusable transitions.

~~~ javascript
var widthTransition = Zanimo.f("width", "200px", 200, "ease-in"),
    heightTransition = Zanimo.f("height", "300px", 200, "ease-in");

Zanimo(myDomElement)
    .then(widthTransition)
    .then(heightTransition);
~~~

## Credits

[@bobylito](http://bobylito.me/) who came up with the name `Zanimo`.
