# Zanimo.js - Promise based CSS3 transitions

Allows chaining of transitions in a promise based way.
It depends on Kris Kowal's [Q.js library](https://github.com/kriskowal/q).

Zanimo.js is licensed under the terms of the MIT License.

## Targeted platforms

Zanimo targets the following platforms:

* Safari
* Firefox
* Chrome
* Internet Explorer 10

## Building

[![Build Status](https://secure.travis-ci.org/peutetre/Zanimo.png?branch=Q)](http://travis-ci.org/peutetre/Zanimo)

~~~ sh
$ make
~~~

## Launch tests

To run tests in your shell, you need [phantomjs](http://code.google.com/p/phantomjs/wiki/Installation).

~~~ sh
$ make test
~~~

Or open test/index.html in a web browser to run the tests.

## API

### Zanimo(elt) ➜  promise [elt]

Take a DOM element and returns a fulfilled promise wrapping the given DOM element.

~~~ javascript
Zanimo(myDomElement).then(...)
~~~

### Zanimo.f(elt) ➜  function(elt) : promise [elt]

Wrap `Zanimo()` in a function.
Usefull for changing the passed DOM element along a promises chain.

~~~ javascript
var anim200pxLeft = Zanimo.transitionf("transform", "translate(200px, 0)", 200);

Zanimo(myDomElement)
    .then(anim200pxLeft)
    .then(Zanimo.f(myOtherDomElement))
    .then(anim200pxLeft)
~~~

### Zanimo.transition(elt, property, value, duration, [timingFunction])  ➜  promise [elt]

Start a transition on the given DOM element, returns a promise.

~~~ javascript
Zanimo
    .transition(myDomElement, "width", "200px", 200, "ease-in")
    .then(function (domElt) { console.log("Done..."); });
~~~

### Zanimo.transitionf(property, value, duration, [timingFunction])  ➜  function(elt) : promise [elt]

Wrap `Zanimo.transition()` in a function.
Usefull for chaining.

~~~ javascript
Zanimo
    .transition(myDomElement, "width", "200px", 200, "ease-in")
    .then(Zanimo.transitionf("height", "300px", 200, "ease-in"));
~~~

### Zanimo.transform(elt, value, [overwrite])  ➜  promise [elt]

Apply a css transform on the given DOM element.

~~~ javascript
Zanimo
    .transform(myDomElement, "translate3d(200px, 200px, 0)")
    .then(function (domElt) { console.log("Done..."); });
~~~

### Zanimo.transformf(value, [overwrite])  ➜  function(elt) : promise [elt]

Wrap `Zanimo.transform()` in a function.
Usefull for chaining.

~~~ javascript
Zanimo(myDomElt)
    .then(Zanimo.transformf("scale(2)", true));
~~~
