/*
 * test-suite.js
 */

function setUp1 () {
    return Specs.Helper.createSquare("test-1");
}

function setDown1 (val) {
    Specs.Helper.removeSquare("test-1");
    return val;
}

function setUp2 () {
    return Specs.Helper.createSquare("test-2");
}

function setDown2 (val) {
    Specs.Helper.removeSquare("test-2");
    return val;
}

Specs.test("opacity transition from 1 to 0 in 200ms", function () {

    return Zanimo(setUp1())
            .then(Zanimo.transitionf("opacity", 0, 2000))
            .then(Specs.done, Specs.fail)
            .then(setDown1, setDown1);
});

Specs.test("display can't handle transitions!", function () {

    return Zanimo(setUp1())
            .then(Zanimo.transitionf("display", 1, 100))
            .then(Specs.fail, Specs.done)
            .then(setDown1, setDown1);
});

Specs.test("translate3d(200px, 0, 0) 200ms", function () {

    return Zanimo(setUp1())
            .then(Zanimo.transitionf("transform", "translate3d(200px, 0, 0)", 200))
            .then(Specs.done, Specs.fail)
            .then(setDown1, setDown1);
});

Specs.test("background-color to blue in 200ms", function () {

    return Zanimo(setUp1())
            .then(Zanimo.transitionf("background-color", "blue", 200))
            .then(Specs.done, Specs.fail)
            .then(setDown1, setDown1);
});

Specs.test("Zanimo() rejects with no DOM element", function () {

    return Q.all([Zanimo("Oops"), Zanimo(), Zanimo([1,2,3])])
            .then(Specs.fail, Specs.done);
});

Specs.test("Zanimo() succeed with a DOM element", function () {

    return Zanimo(setUp1())
            .then(Specs.done, Specs.fail)
            .then(setDown1, setDown1);
});

Specs.test(
    "Zanimo.transition: width to 300px in 400ms with ease-in-out",
    function () {
        return Zanimo.transition(setUp1(), "width", "300px", 400, "ease-in-out")
                .then(Specs.done, Specs.fail)
                .then(setDown1, setDown1);
    }
);

Specs.test(
    "Zanimo.transition: width and height to 300px in 400ms with ease-in-out",
    function () {
        var elt = setUp1();
        return Q.all([
                    Zanimo.transition(elt, "width", "300px", 400, "ease-in-out"),
                    Zanimo.transition(elt, "height", "300px", 400, "ease-in-out")
                ])
                .then(Specs.done, Specs.fail)
                .then(setDown1, setDown1);
    }
);
