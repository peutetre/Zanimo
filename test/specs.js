/*
 * specs.js
 */

if (!phantom.injectJs('test.js')) {
    console.log("Oops test.js not loaded");
    phantom.exit();
}

test("opacity transition 1 -> 0", function (name) {
    return Zanimo(createSquare("opacity-1"))
            .then(Zanimo.transitionf("opacity", 0, 200))
            .then(done, fail);
});

test("this should failed", function (name) {
    return Zanimo(createSquare("opacity-2"))
            .then(Zanimo.transitionf("display", 1, 100))
            .then(done, fail);
});

// start tests
start();
