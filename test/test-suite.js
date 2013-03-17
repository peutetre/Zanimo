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

    return Q.when(Q.delay(200), function () {
        return Q.all([Zanimo("Oops"), Zanimo(), Zanimo([1,2,3])])
                .then(Specs.fail("Resolve"), Specs.done("Reject"));
    });
});

Specs.test("Zanimo() succeed with a DOM element", function () {
    var elt = setUp1();

    return Q.when(Q.delay(200), function () {
        return Zanimo(elt)
                .then(Specs.done("Resolve"), Specs.fail("Reject"))
                .then(setDown1, setDown1);
    });
});

Specs.test("Zanimo() succeed with a promise of a DOM element", function () {
    var elt = setUp1(),
        d = Q.defer();

    setTimeout(function () {
        d.resolve(elt);
    }, 500);

    return Q.when(Q.delay(200), function () {
        return Zanimo(d.promise)
                .then(Specs.done("Resolve"), Specs.fail("Reject"))
                .then(setDown1, setDown1);
    });
});

Specs.test("Zanimo() fail with a promise of a number", function () {
    var elt = setUp1(),
        d = Q.defer();

    setTimeout(function () {
        d.resolve(1);
    }, 500);

    return Q.when(Q.delay(200), function () {
        return Zanimo(d.promise)
                .then(Specs.fail("Resolve"), Specs.done("Reject"))
                .then(setDown1, setDown1);
    });
});

/*
 * Testing Zanimo.transition()
 */
Specs.test(
    "Zanimo.transition: width to 300px in 400ms with ease-in-out",
    function () {
        var elt = setUp1();

        return Q.when(Q.delay(200), function () {
            return Zanimo.transition(elt, "width", "300px", 400, "ease-in-out")
                    .then(Specs.done("Resolve"), Specs.fail("Reject"))
                    .then(setDown1, setDown1);
        });
    }
);

Specs.test(
    "Zanimo.transition: width and height to 300px in 400ms with ease-in-out",
    function () {
        var elt = setUp1();

        return Q.when(Q.delay(200), function () {
                return Q.all([
                    Zanimo.transition(elt, "width", "300px", 400, "ease-in-out"),
                    Zanimo.transition(elt, "height", "300px", 400, "ease-in-out")
                ])
                .then(Specs.done("Resolve"), Specs.fail("Reject"))
                .then(setDown1, setDown1);
        });
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

        return Q.when(Q.delay(200), function () {
            return Zanimo.transition(elt1, "transform", "translate(200px, 0)", 300)
                     .then(function () {
                         return Zanimo.transition(elt2, "transform", "translate(0, 200px)", 100);
                     })
                     .then(Specs.done("Resolve"), Specs.fail("Reject"))
                     .then(down, down);
        });
    }
);

Specs.test(
    "Zanimo.transition: call with wrong DOM element",
    function () {
        return Q.when(Q.delay(200), function () {
            return Zanimo
                    .transition("Oops", "opacity", 1, 100)
                    .then(Specs.fail("Resolve"), Specs.done("Reject"));
        });
    }
);

Specs.test(
    "Zanimo.transition: call with wrong transition property",
    function () {
        var elt = setUp1();

        return Q.when(Q.delay(200), function () {
            return Zanimo
                    .transition(elt, "toto", "test", 100)
                    .then(Specs.fail("Resolve"), Specs.done("Reject"))
                    .then(setDown1, setDown1);
        });
    }
);

Specs.test(
    "Zanimo.transition: call with wrong time value",
    function () {
        var elt = setUp1();

        return Q.when(Q.delay(200), function () {
            return Zanimo
                    .transition(elt, "opacity", 0.5, "oops", "linear")
                    .then(Specs.fail("Resolve"), Specs.done("Reject"))
                    .then(setDown1, setDown1);
        });
    }
);

/*
 * Testing Zanimo.transitionf()
 */
Specs.test("opacity transition from 1 to 0 in 200ms", function () {
    var elt = setUp1();

    return Q.when(Q.delay(200), function () {
        return Zanimo(elt)
                .then(Zanimo.transitionf("opacity", 0, 2000))
                .then(Specs.done("Resolve"), Specs.fail("Reject"))
                .then(setDown1, setDown1);
    });
});

Specs.test("display can't handle transitions!", function () {
    var elt = setUp1();

    return Q.when(Q.delay(200), function () {
        return Zanimo(elt)
                .then(Zanimo.transitionf("display", 1, 100))
                .then(Specs.fail("Resolve"), Specs.done("Reject"))
                .then(setDown1, setDown1);
    });
});

Specs.test("translate(200px, 0) 200ms", function () {
    var elt = setUp1();

    return Q.when(Q.delay(200), function () {
        return Zanimo(elt)
                .then(Zanimo.transitionf("transform", "translate(200px, 0)", 200))
                .then(Specs.done("Resolve"), Specs.fail("Reject"))
                .then(setDown1, setDown1);
    });
});

Specs.test("background-color to blue in 200ms", function () {
    var elt = setUp1();

    return Q.when(Q.delay(200), function () {
        return Zanimo(elt)
                .then(Zanimo.transitionf("background-color", "blue", 200))
                .then(Specs.done("Resolve"), Specs.fail("Reject"))
                .then(setDown1, setDown1);
    });
});

/*
 * Testing the behavior of multiple Zanimo transitions on the same element.
 */
Specs.test(
    "Zanimo.transition: 2 same transitions on the same element, part 1",
    function () {
        var elt = setUp1(),
            transition1 = Zanimo.transitionf("transform", "translate(200px, 0)", 400),
            transition2 = Zanimo.transitionf("transform", "translate(100px, 300px)", 100);

        Q.when(Q.delay(200), function () {
            return Zanimo(elt).delay(100).then(transition2);
        });

        return Q.when(Q.delay(200), function () {
            return Zanimo(elt)
                    .then(transition1)
                    .then(Specs.fail("Resolve"), Specs.done("Reject"))
                    .then(setDown1, setDown1);
        });
    }
);

Specs.test(
    "Zanimo.transition: 2 same transitions on the same element, part 2",
    function () {
        var elt = setUp1(),
            transition1 = Zanimo.transitionf("transform", "translate(200px, 0)", 400),
            transition2 = Zanimo.transitionf("transform", "translate(100px, 300px)", 100);

        Zanimo(elt).then(transition1);

        Q.when(Q.delay(200), function () {
            return Zanimo(elt).then(transition1);
        });

        return Q.when(Q.delay(200), function () {
            return Zanimo(elt)
                    .delay(100)
                    .then(transition2)
                    .then(Specs.done("Resolve"), Specs.fail("Reject"))
                    .then(setDown1, setDown1);
        });
    }
);

/*
 * Test Zanimo.transform()
 */
Specs.test(
    "Zanimo.transform() with no DOM element",
    function () {
        return Q.when(Q.delay(200), function () {
            return Zanimo
                    .transform("Oops", "translate(100px, 0)")
                    .then(Specs.fail("Resolve"), Specs.done("Reject"));
        });
    }
);

Specs.test(
    "Zanimo.transform() with translate(200px, 0)",
    function () {
        var elt = setUp1();

        return Q.when(Q.delay(200), function () {
            return Zanimo
                    .transform(elt, "translate(200px, 0)")
                    .then(Specs.done("Resolve"), Specs.fail("Reject"))
                    .then(setDown1, setDown1);
        });
    }
);

Specs.test(
    "Testing Zanimo.transform() and transition:transform on the same element part 1",
    function () {
        var elt = setUp1();

        Q.when(Q.delay(200), function () {
            return Zanimo(elt)
                    .then(Zanimo.transition("transform", "translate(200px, 0)", 400));
        });

        return Q.when(Q.delay(200), function () {
            return Zanimo
                    .transform(elt, "translate(00px, 200px)")
                    .then(Specs.done("Resolve"), Specs.fail("Reject"))
                    .then(setDown1, setDown1);
        });
    }
);

Specs.test(
    "Testing Zanimo.transform() and transition:transform on the same element part 2",
    function () {
        var elt = setUp1();

        Q.delay(300).then(function () {
             return Zanimo.transform(elt, "translate(00px, 200px)");
        });

        return Q.when(Q.delay(200), function () {
            return Zanimo(elt)
                    .then(Zanimo.transitionf("transform", "translate(200px, 0)", 400))
                    .then(Specs.fail("Resolve"), Specs.done("Reject"))
                    .then(setDown1, setDown1);
        });
    }
);

/*
 * Test Zanimo.transformf()
 */
Specs.test(
    "Zanimo.transformf() 'scale(2.0)'",
    function () {
        var elt = setUp1();

        return Q.when(Q.delay(200), function () {
            return Zanimo(elt)
                    .then(Zanimo.transformf("scale(2.0)"))
                    .then(Specs.done("Resolve"), Specs.fail("Reject"))
                    .then(setDown1, setDown1);
        });
    }
);

Specs.test(
    "Zanimo.transformf(): overwrite=true on animated elt",
    function () {
        var elt = setUp1();

        Q.delay(200).then(function () {
             return Zanimo(elt)
                      .then(Zanimo.transitionf("transform", "translate(200px, 0)", 400));
        });

        return Q.delay(300)
                .then(Zanimo.f(elt))
                .then(Zanimo.transformf("translate(0, 200px)", true))
                .then(function (elt) {
                    var d = Q.defer();
                    if (Zanimo._T.normTransform(elt.style[Zanimo._T.transform])
                        === Zanimo._T.normTransform("translate(0, 200px)")) {
                        d.resolve(elt);
                    }
                    else {
                        d.reject(new Error("Fail: "
                            + Zanimo._T.normTransform(elt.style[Zanimo._T.transform])
                            + " " + Zanimo._T.normTransform("translate(200px, 0)")
                        ));
                    }
                    return d.promise;
                })
                .then(Specs.done("Resolve"), Specs.fail("Reject"))
                .then(setDown1, setDown1);
    }
);

Specs.test(
    "Zanimo.transformf(): overwrite=false on animated elt",
    function () {
        var elt = setUp1();

        Q.delay(200).then(function () {
             return Zanimo(elt)
                      .then(Zanimo.transitionf("transform", "translate(200px, 0)", 400));
        });

        return Q.delay(300)
                .then(Zanimo.f(elt))
                .then(Zanimo.transformf("translate(0, 200px)"))
                .then(function (elt) {
                    var d = Q.defer();
                    if (Zanimo._T.normTransform(elt.style[Zanimo._T.transform])
                        === Zanimo._T.normTransform("translate(200px, 0) translate(0, 200px)")) {
                        d.resolve(elt);
                    }
                    else {
                        d.reject(new Error("Fail: "
                            + Zanimo._T.normTransform(elt.style[Zanimo._T.transform])
                            + " " + Zanimo._T.normTransform("translate(200px, 0) translate(200px, 0)")
                        ));
                    }
                    return d.promise;
                })
                .then(Specs.done("Resolve"), Specs.fail("Reject"))
                .then(setDown1, setDown1);
    }
);

/*
 * Test Zanimo.f()
 */
Specs.test(
    "Zanimo.f() resolve with a HTML element",
    function () {
        var elt1 = setUp1(),
            elt2 = setUp2(),
            down = function (r) { setDown1(); setDown2(); return r; };

        return Q.when(Q.delay(200), function () {
            return Zanimo(elt1)
                    .then(Zanimo.transitionf("opacity", 0.5, 100, "ease-in"))
                    .then(Zanimo.f(elt2))
                    .then(Zanimo.transitionf("opacity", 0.5, 100, "ease-in"))
                    .then(Specs.done("Resolve"), Specs.fail("Reject"))
                    .then(down, down);
        });
    }
);

Specs.test(
    "Zanimo.f() rejects without a DOM element",
    function () {
        var elt = setUp1();

        return Q.when(Q.delay(200), function () {
            return Zanimo(elt)
                    .then(Zanimo.transitionf("opacity", 0.5, 100, "ease-in"))
                    .then(Zanimo.f())
                    .then(Specs.fail("Resolve"), Specs.done("Reject"))
                    .then(setDown1, setDown1);
        });
    }
);

Specs.test(
    "Zanimo.transition: make 4 same transitions sequentially with the same element (opacity)",
    function () {
        var elt = setUp1(),
            transition1 = Zanimo.transitionf("opacity", 0, 200),
            opacity1 = function (elt) {
                elt.style.opacity = 1;
                return elt;
            };

        return Q.when(Q.delay(200), function () {
            return Zanimo(elt)
                    .then(transition1)
                    .then(opacity1)
                    .then(transition1)
                    .then(opacity1)
                    .then(transition1)
                    .then(opacity1)
                    .then(transition1)
                    .then(Specs.done("Resolve"), Specs.fail("Reject"))
                    .then(setDown1, setDown1);
        });
    }
);

Specs.test(
    "Zanimo.transition: make 4 same transitions sequentially with the same element (transform)",
    function () {
        var elt = setUp1(),
            transition1 = Zanimo.transitionf("transform", "translate(200px, 0)", 500),
            transform1 = Zanimo.transformf("translate(0,0)", true);

        return Q.when(Q.delay(200), function () {
            return Zanimo(elt)
                    .then(transition1)
                    .then(transform1)
                    .then(transition1)
                    .then(transform1)
                    .then(transition1)
                    .then(transform1)
                    .then(transition1)
                    .then(Specs.done("Resolve"), Specs.fail("Reject"))
                    .then(setDown1, setDown1);
        });
    }
);
