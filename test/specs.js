/*
 * specs.js
 */

test("Opacity transition from 1 to 0 in 2000ms", function (name) {

    function setUp () {
        return createSquare("opacity-1");
    }

    function setDown (val) {
        removeSquare("opacity-1");
        return val;
    }

    return Zanimo(setUp())
            .then(Zanimo.transitionf("opacity", 0, 2000))
            .then(done, fail)
            .then(setDown, setDown);
});

test("This should failed", function (name) {

    function setUp () {
        return createSquare("opacity-2");
    }

    function setDown (val) {
        removeSquare("opacity-2");
        return val;
    }

    return Zanimo(setUp())
            .then(Zanimo.transitionf("display", 1, 100))
            .then(done, fail)
            .then(setDown, setDown);
});
