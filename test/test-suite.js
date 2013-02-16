/*
 * test-suite.js
 */

/*
 * helpers
 */

function setUp1 () {
    return Helper.createSquare("test-1");
}

function setDown1 (val) {
    Helper.removeSquare("test-1");
    return val;
}

function setUp2 () {
    return Helper.createSquare("test-2");
}

function setDown2 (val) {
    Helper.removeSquare("test-2");
    return val;
}

/*
 * Testing Zanimo()
 */
Specs.test("Zanimo() rejects with no DOM element", function () {

    return Q.all([Zanimo("Oops"), Zanimo(), Zanimo([1,2,3])])
            .then(Specs.fail("Resolve"), Specs.done("Reject"));
});

Specs.test("Zanimo() succeed with a DOM element", function () {

    return Zanimo(setUp1())
            .then(Specs.done("Resolve"), Specs.fail("Reject"))
            .then(setDown1, setDown1);
});

/*
 * Testing Zanimo.transition()
 */
Specs.test(
    "Zanimo.transition: width to 300px in 400ms with ease-in-out",
    function () {
        return Zanimo.transition(setUp1(), "width", "300px", 400, "ease-in-out")
                .then(Specs.done("Resolve"), Specs.fail("Reject"))
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
                .then(Specs.done("Resolve"), Specs.fail("Reject"))
                .then(setDown1, setDown1);
    }
);

Specs.test(
    "Zanimo.transition: chaining 2 transition with 2 elements",
    function () {
        var elt1 = setUp1(),
            elt2 = setUp2(),
            down = function (r) {
                setDown1();
                return setDown2(r);
            };
        return Zanimo.transition(elt1, "transform", "translate3d(200px, 0, 0)", 300)
                .then(function () {
                    return Zanimo.transition(elt2, "transform", "translate3d(0, 200px, 0)", 100);
                })
                .then(Specs.done("Resolve"), Specs.fail("Reject"))
                .then(down, down);
    }
);

Specs.test(
    "Zanimo.transition: call with wrong DOM element",
    function () {
        return Zanimo
                .transition("Oops", "opacity", 1, 100)
                .then(Specs.fail("Resolve"), Specs.done("Reject"));
    }
);

Specs.test(
    "Zanimo.transition: call with wrong transition property",
    function () {
        return Zanimo
                .transition(setUp1(), "toto", "test", 100)
                .then(Specs.fail("Resolve"), Specs.done("Reject"))
                .then(setDown1, setDown1);
    }
);

Specs.test(
    "Zanimo.transition: call with wrong time value",
    function () {
        return Zanimo
                .transition(setUp1(), "opacity", 0.5, "oops", "linear")
                .then(Specs.fail("Resolve"), Specs.done("Reject"))
                .then(setDown1, setDown1);
    }
);

/*
 * Testing Zanimo.transitionf()
 */
Specs.test("opacity transition from 1 to 0 in 200ms", function () {

    return Zanimo(setUp1())
            .then(Zanimo.transitionf("opacity", 0, 2000))
            .then(Specs.done("Resolve"), Specs.fail("Reject"))
            .then(setDown1, setDown1);
});

Specs.test("display can't handle transitions!", function () {

    return Zanimo(setUp1())
            .then(Zanimo.transitionf("display", 1, 100))
            .then(Specs.fail("Resolve"), Specs.done("Reject"))
            .then(setDown1, setDown1);
});

Specs.test("translate3d(200px, 0, 0) 200ms", function () {

    return Zanimo(setUp1())
            .then(Zanimo.transitionf("transform", "translate3d(200px, 0, 0)", 200))
            .then(Specs.done("Resolve"), Specs.fail("Reject"))
            .then(setDown1, setDown1);
});

Specs.test("background-color to blue in 200ms", function () {

    return Zanimo(setUp1())
            .then(Zanimo.transitionf("background-color", "blue", 200))
            .then(Specs.done("Resolve"), Specs.fail("Reject"))
            .then(setDown1, setDown1);
});

/*
 * Testing the behavior of multiple Zanimo transitions on the same element.
 */
Specs.test(
    "FIXME Zanimo.transition: 2 same transitions on the same element, part 1",
    function () {
        var elt = setUp1(),
            transition1 = Zanimo.transitionf("transform", "translate3d(200px, 0, 0)", 400),
            transition2 = Zanimo.transitionf("transform", "translate3d(100px, 300px, 0)", 100);
        return Q.all([
                   Zanimo(elt).then(transition1).then(Specs.fail("Resolve"), Specs.done("Reject")),
                   Zanimo(elt).delay(100).then(transition2)
               ]).then(setDown1, setDown1);
    }
);

Specs.test(
    "FIXME Zanimo.transition: 2 same transitions on the same element, part 2",
    function () {
        var elt = setUp1(),
            transition1 = Zanimo.transitionf("transform", "translate3d(200px, 0, 0)", 400),
            transition2 = Zanimo.transitionf("transform", "translate3d(100px, 300px, 0)", 100);
        return Q.all([
                   Zanimo(elt).then(transition1),
                   Zanimo(elt).delay(100).then(transition2).then(Specs.done("Resolve"), Specs.fail("Reject"))
               ]).then(setDown1, setDown1);
    }
);

/*
 * Test Zanimo.transform()
 */
Specs.test(
    "TODO Testing Zanimo.transform()",
    function () {
        return Q.reject(new Error("not implemented"))
                .then(Specs.done("Resolve"), Specs.fail("Reject"));
    }
);

/*
 * Test Zanimo.transformf()
 */
Specs.test(
    "TODO Testing Zanimo.transformf()",
    function () {
        return Q.reject(new Error("not implemented"))
                .then(Specs.done("Resolve"), Specs.fail("Reject"));
    }
);

/*
 * Test Zanimo.f()
 */
Specs.test(
    "TODO Testing Zanimo.f()",
    function () {
        return Q.reject(new Error("not implemented"))
                .then(Specs.done("Resolve"), Specs.fail("Reject"));
    }
);
