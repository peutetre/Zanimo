# Zanimo.js - Promise based CSS3 transitions

Allows chaining of transitions in a promise based way using Kris Kowal's [Q.js library](https://github.com/kriskowal/q).

Zanimo.js is licensed under the terms of the MIT License.

## Targeted platforms

Zanimo targets the following platforms:

* Safari
* Firefox
* Chrome
* Internet Explorer 10

[![browser support](https://ci.testling.com/peutetre/Zanimo.png)](https://ci.testling.com/peutetre/Zanimo)

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

Or open [test/index.html](http://peutetre.github.com/Zanimo/test/index.html) in a web browser.

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

### Zanimo.transition(elt, property, value, duration, [timingFunction])  ➜  promise[elt]

Starts a transition on the given DOM element and returns a promise.
For now Zanimo does not support hexadecimal color notation or 0px (just use 0) in the value argument.

~~~ javascript
Zanimo
    .transition(myDomElement, "width", "200px", 200, "ease-in")
    .then(
        function (domElt) { /* do something on success */ },
        function (reason) { /* do something on error */ }
    );
~~~

### Zanimo.transitionf(property, value, duration, [timingFunction])  ➜  ( function(elt) ➜  promise[elt] )

Encapsulates `Zanimo.transition()` in a function. Useful to define reusable transitions.

~~~ javascript
var widthTransition = Zanimo.transitionf("width", "200px", 200, "ease-in"),
    heightTransition = Zanimo.transitionf("height", "300px", 200, "ease-in");

Zanimo(myDomElement)
    .then(widthTransition)
    .then(heightTransition);
~~~

### Zanimo.transform(elt, value, [overwrite])  ➜  promise[elt]

Applies a css transform on the given DOM element.

~~~ javascript
Zanimo
    .transform(myDomElement, "translate3d(200px, 200px, 0)")
    .then(function (domElt) { console.log("Done..."); });
~~~

### Zanimo.transformf(value, [overwrite])  ➜  ( function(elt) ➜  promise[elt] )

Encapsulates `Zanimo.transform()` in a function. Useful for chaining.

~~~ javascript
Zanimo(myDomElt).then(Zanimo.transformf("scale(2)", true));
~~~

### Zanimo.all(array[function(elt) ➜  promise[elt]])  ➜  (function(elt) ➜  promise[elt])

Helps executing multiple transitions in the same step.

~~~ javascript
var anim1 = Zanimo.transitionf("opacity", 0.5, 200),
    anim2 = Zanimo.transitionf("width", "400px", 400);

Zanimo(myDomElt).then(Zanimo.all([anim1, anim2]));
~~~

### Zanimo.f(elt|promise[elt]) ➜  ( function(elt) ➜  promise[elt] )

Useful for changing a given DOM element along a promises chain.

~~~ javascript
var anim200pxLeft = Zanimo.transitionf("transform", "translate(200px, 0)", 200);

Zanimo(myDomElement)
    .then(anim200pxLeft)
    .then(Zanimo.f(myOtherDomElement))
    .then(anim200pxLeft)
~~~

## Credits

[@bobylito](http://bobylito.me/) who came up with the name `Zanimo`.
