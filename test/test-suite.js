/*
 * test-suite.js
 */

Specs.test("Opacity transition from 1 to 0 in 2000ms", function (name) {

    function setUp () {
        return Specs.Helper.createSquare("opacity-1");
    }

    function setDown (val) {
        Specs.Helper.removeSquare("opacity-1");
        return val;
    }

    return Zanimo(setUp())
            .then(Zanimo.transitionf("opacity", 0, 2000))
            .then(Specs.done, Specs.fail)
            .then(setDown, setDown);
});

Specs.test("This should failed", function (name) {

    function setUp () {
        return Specs.Helper.createSquare("opacity-2");
    }

    function setDown (val) {
        Specs.Helper.removeSquare("opacity-2");
        return val;
    }

    return Zanimo(setUp())
            .then(Zanimo.transitionf("display", 1, 100))
            .then(Specs.done, Specs.fail)
            .then(setDown, setDown);
});


Specs.test("Test with Q, this succeed", function (name) {
    return Q.resolve("yes").then(Specs.done, Specs.fail);
});

Specs.test("Test with Q, this should fail", function (name) {
    return Q.reject(new Error("~~ nothing error ~~")).then(Specs.done, Specs.fail);
});
