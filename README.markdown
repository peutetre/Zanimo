# Zanimo.js

`Zanimo.js` is a animation library based on CSS3 transitions and promises.
As CSS3 transitions are not supported by IE, this should works on FireFox, Safari, Chrome and Opera.

The promises are based on the q7 design example of Kris Kowal's Q library (https://github.com/kriskowal/q/blob/master/design/q7.js).

### Demo/Examples/Tests

See `examples/index.html` for the demo/examples.

## Usage

```javaScript
Zanimo.transition(domElt, "width", "200px", 1000, "ease-in")
      .then(function () { alert("Transition done!"); });
```

## TODO

* adding more tests/examples
* better documentation
* adding a Zanimo.animate() which doesn't use transitions, in the case you want to stop the animation at any time.
