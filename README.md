# Zanimo.js - Promise based CSS3 transitions

Allows chaining of transitions in a promise based way using Kris Kowal's [Q.js library](https://github.com/kriskowal/q).

Zanimo.js is licensed under the terms of the MIT License.

## Targeted platforms

Zanimo targets the following platforms:

* Safari
* Firefox
* Chrome
* Internet Explorer 10

## Install

via bower

~~~ sh
bower install zanimo
~~~

via npm and browserify. [Example repo](https://github.com/peutetre/zanimo-npm-dummy-example)

## Building

[![Build Status](https://secure.travis-ci.org/peutetre/Zanimo.png?branch=Q)](http://travis-ci.org/peutetre/Zanimo)

[![Dependency Status](https://gemnasium.com/peutetre/Zanimo.png)](https://gemnasium.com/peutetre/Zanimo)

[![SauceLabs Status](https://saucelabs.com/browser-matrix/zanimo.svg)](https://saucelabs.com/u/zanimo)
~~~ sh
$ make
~~~

## Launch tests

### phantomjs
To run tests in your shell, you need [phantomjs](http://code.google.com/p/phantomjs/wiki/Installation).

~~~ sh
$ make test
~~~

Or open [test/index.html](http://peutetre.github.com/Zanimo/test/index.html) in a web browser.

### SauceLabs

To run tests via SauceLabs, you need to set up the following environment variables `SAUCE_USERNAME` and `SAUCE_ACCESS_KEY`

~~~sh
$ make sauce
~~~

## API

### Zanimo(elt|promise[elt]) ➜  promise[elt]

Takes a DOM element or a promise of a DOM element and returns a promise of the given element.

~~~ javascript
Zanimo(myDomElement).then(function (elt) {
    // do something with the DOM element
}, function (reason) {
    // do something when `myDOMElement` isn't a DOM element
});
~~~


### Zanimo(elt, property, value) ➜  promise[elt]

Applies a css style on the given DOM element.

~~~ javascript
Zanimo(myDomElement, "transform", "translate3d(200px, 200px, 0)")
    .then(function (domElt) { console.log("Done..."); });
~~~


### Zanimo(elt, property, value, duration, [timingFunction])  ➜  promise[elt]

Starts a transition on the given DOM element and returns a promise.
For now Zanimo does not support hexadecimal color notation or 0px (just use 0) in the value argument.

~~~ javascript
Zanimo(myDomElement, "width", "200px", 200, "ease-in")
    .then(
        function (domElt) { /* do something on success */ },
        function (reason) { /* do something on error */ }
    );
~~~

### Zanimo.f(*)  ➜  ( function(elt) ➜  promise[elt] )

Encapsulates a `Zanimo(elt, *)` call by returning a function (elt)➜promise[elt]. 

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
