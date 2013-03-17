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

### Zanimo(elt|promise[elt]) ➜  promise[elt]

Take a DOM element or a promise of a DOM element and returns a promise of the given element.

~~~ javascript
Zanimo(myDomElement).then(function (elt) {
    // do something with the DOM element
}, function (reason) {
    // do something when `myDOMElement` isn't a DOM element
});
~~~

### Zanimo.f(elt|promise[elt]) ➜  ( function(elt) ➜  promise[elt] )

Usefull for changing a given DOM element along a promises chain.

~~~ javascript
var anim200pxLeft = Zanimo.transitionf("transform", "translate(200px, 0)", 200);

Zanimo(myDomElement)
    .then(anim200pxLeft)
    .then(Zanimo.f(myOtherDomElement))
    .then(anim200pxLeft)
~~~

### Zanimo.transition(elt, property, value, duration, [timingFunction])  ➜  promise[elt]

Start a transition on the given DOM element and returns a promise.

~~~ javascript
Zanimo
    .transition(myDomElement, "width", "200px", 200, "ease-in")
    .then(
        function (domElt) { /* do something on success */ },
        function (reason) { /* do something on error */ }
    );
~~~

### Zanimo.transitionf(property, value, duration, [timingFunction])  ➜  ( function(elt) ➜  promise[elt] )

Encapsulate `Zanimo.transition()` in a function. Usefull to define reusable transitions.

~~~ javascript
var widthTransition = Zanimo.transitionf("width", "200px", 200, "ease-in"),
    heightTransition = Zanimo.transitionf("height", "300px", 200, "ease-in");

Zanimo(myDomElement)
    .then(widthTransition)
    .then(heightTransition);
~~~

### Zanimo.transform(elt, value, [overwrite])  ➜  promise[elt]

Apply a css transform on the given DOM element.

~~~ javascript
Zanimo
    .transform(myDomElement, "translate3d(200px, 200px, 0)")
    .then(function (domElt) { console.log("Done..."); });
~~~

### Zanimo.transformf(value, [overwrite])  ➜  ( function(elt) ➜  promise[elt] )

Encapsulate `Zanimo.transform()` in a function. Usefull for chaining.

~~~ javascript
Zanimo(myDomElt).then(Zanimo.transformf("scale(2)", true));
~~~
