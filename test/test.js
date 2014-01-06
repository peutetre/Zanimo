/*
 * test.js
 */

'use strict';

require("mocha-as-promised")();

var normalizeTransformValue = require('../src/normalize-transform-value'),
    Zanimo = require('..'),
    Q = require('q'),
    prefix = require('prefix'),
    expect = require('expect.js');

Q.longStackSupport = true;

function createSquare(id) {
    var elt = document.createElement("div");
    elt.id = id;
    elt.style.width = "100px";
    elt.style.height = "100px";
    elt.style.backgroundColor = "red";
    document.body.appendChild(elt);
    return elt;
};

function removeSquare(id) {
    document.body.removeChild(document.getElementById(id));
};

function setUp1 () { return createSquare("test-1"); }
function setDown1 (val) { removeSquare("test-1"); return val; }
function setUp2 () { return createSquare("test-2"); }
function setDown2 (val) { removeSquare("test-2"); return val; }

describe('normalizeTransformValue', function () {
    it('should return `translate3d(0,0,0)` when called with `translate3d(0px ,0, 0  )`', function () {
        expect(normalizeTransformValue('translate3d(0px ,0, 0  )')).to.eql('translate3d(0,0,0)');
    });
    it('should return `translate3d(0,200px,0) rotateY(280deg) translate3d(0,0,30px)` when called with `translate3d(0px ,200px, 0  )  rotateY(280deg)        translate3d( 0 , 0,30px)`', function () {
        expect(normalizeTransformValue('translate3d(0px ,200px, 0  )  rotateY(280deg)        translate3d( 0 , 0,30px)')).to.eql('translate3d(0,200px,0) rotateY(280deg) translate3d(0,0,30px)');
    });
    it('should return an empty string when called with no arg', function () {
        expect(normalizeTransformValue()).to.eql('');
    });
});

describe('Zanimo', function () {

    it('rejects with no DOM element', function () {
        return Q.all([Q.fcall(Zanimo, 'Oops'), Q.fcall(Zanimo), Q.fcall(Zanimo, [1,2,3])])
            .fail(function (err) {
                return expect(err).to.be.a(Error);
            });
    });

    it('succeeded with a DOM element', function () {
        var elt = setUp1();

        return Q.when(Q.delay(200), function () {
            return Zanimo(elt)
                    .then(function (el) {
                        expect(el).to.be.a(window.Element);
                        setDown1();
                    });
        });
    });

    it('succeeded with a promise of a DOM element', function () {
        var elt = setUp1(),
            d = Q.defer();

        setTimeout(function () {
            d.resolve(elt);
        }, 500);

        return Q.when(Q.delay(200), function () {
            return Zanimo(d.promise)
                .then(function (el) {
                    expect(el).to.be.a(window.Element);
                    setDown1();
                });
        });
    });

    it('failed with a promise of number', function () {
        var elt = setUp1(),
            d = Q.defer();

        setTimeout(function () {
            d.resolve(1);
        }, 500);

        return Q.when(Q.delay(200), function () {
            return Zanimo(d.promise)
                .fail(function (err) {
                    setDown1();
                    expect(err).to.be.a(Error);
                });
        });
    });

    it('succeeded transitioning the width of a element from 100px to 300px in 400ms with ease-in-out timing function', function() {
        var elt = setUp1();

        return Q.when(Q.delay(200), function () {

            expect(elt.style.width).to.eql('100px');

            return Zanimo(elt, "width", "300px", 400, "ease-in-out")
                .then(function (el) {
                    expect(el.style.width).to.eql('300px');
                    setDown1();
                });
        });

     });

    it('succeeded transitioning the width and height of a element from 100px to 300px in 400ms with ease-in-out timing function', function() {
        var elt = setUp1();

        return Q.when(Q.delay(200), function () {

            expect(elt.style.width).to.eql('100px');
            expect(elt.style.height).to.eql('100px');

            return  Q.all([
                    Zanimo(elt, "width", "300px", 400, "ease-in-out"),
                    Zanimo(elt, "height", "300px", 400, "ease-in-out")
                ])
                .then(function (elts) {
                    expect(elts[0].style.width).to.eql('300px');
                    expect(elts[0].style.height).to.eql('300px');
                    setDown1();
                });
        });

     });

    it('succeeded chaining of 2 transitions with 2 elements', function () {
        var elt1 = setUp1(),
            elt2 = setUp2(),
            down = function (r) {
                setDown1();
                return setDown2(r);
            };

        return Q.when(Q.delay(200), function () {
            return Zanimo(elt1, "transform", "translate(200px, 0)", 300)
                .then(function () {
                    expect(elt1.style[prefix('transform')]).to.be.eql('translate(200px, 0)');
                    return Zanimo(elt2, "transform", "translate(0, 200px)", 100);
                })
                .then(function (el) {
                    expect(el.style[prefix('transform')]).to.be.eql('translate(0, 200px)');
                    down();
                });
        });
    });

    it('failed when called with not a DOM element', function () {
        return Q.when(Q.delay(200), function () {
            return Q.fcall(Zanimo, "Oops", "opacity", 1, 100)
                    .fail(function (err) {
                        return expect(err).to.be.a(Error);
                    });
        });
    });

    it('failed when called with a wrong transition property', function () {
        var elt = setUp1();

        return Q.when(Q.delay(200), function () {
            return Q.fcall(Zanimo, elt, "toto", "test", 100)
                    .fail(function (err) {
                        setDown1();
                        return expect(err).to.be.a(Error);
                    });
        });
    });

    it('failed when called with a wrong time value', function () {
        var elt = setUp1();

        return Q.when(Q.delay(200), function () {
            return Q.fcall(Zanimo, elt, "opacity", 0.5, "oops", "linear")
                    .fail(function (err) {
                        setDown1();
                        return expect(err).to.be.a(Error);
                    });
        });
    });

    it('succeeded while setting the transform css property of an element to `translate(200px, 0)`', function () {
        var elt = setUp1();

        return Q.delay(200).then(function () {
            return Zanimo(elt, "transform", "translate(200px, 0)")
                .then(setDown1);
        });
    });


});

describe('Zanimo.f', function () {

    it('succeeded transitioning the opacity of an element from 1 to 0 in 200ms', function () {
        var elt = setUp1();

        return Q.delay(200).then(function () {
            return Zanimo(elt)
                .then(Zanimo.f("opacity", 0, 200))
                .then(setDown1);
        });
    });

    it('failed when trying to perform a transition on the display css property', function () {
        var elt = setUp1();

        return Q.delay(200).then(function () {
            return Zanimo(elt)
                .then(Zanimo.f("display", 1, 100))
                .fail(function (err) {
                    setDown1();
                    return expect(err).to.be.a(Error);
                });
        });
    });

    it('succeeded transitioning the transform property of an element from nothing to `translate(200px, 0)` in 200ms', function () {
        var elt = setUp1();

        return Q.delay(200).then(function () {
            return Zanimo(elt)
                .then(Zanimo.f("transform", "translate(200px, 0)", 200))
                .then(setDown1);
        });
    });

    it('succeeded transitioning the background-color property of an element from red to blue in 200ms', function () {
        var elt = setUp1();

        return Q.delay(200).then(function () {
            return Zanimo(elt)
                .then(Zanimo.f("background-color", "blue", 200))
                .then(setDown1);
        });
    });

    it('failed on the first call when called 2 times on the same element on the same css property', function () {
        var elt = setUp1(),
            transition1 = Zanimo.f("transform", "translate(200px, 0)", 400),
            transition2 = Zanimo.f("transform", "translate(100px, 300px)", 100);

        Q.when(Q.delay(200), function () {
            return Zanimo(elt).delay(100).then(transition2);
        });

        return Q.when(Q.delay(200), function () {
            return Zanimo(elt)
                .then(transition1)
                .fail(function (err) {
                    setDown1();
                    return expect(err).to.be.a(Error);
                });
        });
    });

    it('succeeded when called on an element already in transition from another Zanimo call with the same css property', function () {
        var elt = setUp1(),
            transition1 = Zanimo.f("transform", "translate(200px, 0)", 400),
            transition2 = Zanimo.f("transform", "translate(100px, 300px)", 100);

        Q.delay(200).then(function () {
            Zanimo(elt).then(transition1);
        });

        return Q.delay(200).then(function () {
            return Zanimo(elt)
                    .delay(100)
                    .then(transition2)
                    .then(setDown1);
        });
    });

    it('succeeded a css transform on an element already in a Zanimo transition', function () {
        var elt = setUp1();

        Q.delay(200).then(function () {
            Zanimo(elt).then(Zanimo.f("transform", "translate(200px, 0)", 400));
        });

        return Q.delay(200).then(function () {
            return Zanimo(elt, "transform", "translate(00px, 200px)")
                    .then(setDown1);
        });
    });

    it('failed to perform a transition on a element if a transform with the same property is applied during the animation', function () {
        var elt = setUp1();

        Q.delay(300).then(function () {
             Zanimo(elt, "transform", "translate(00px, 200px)");
        });

        return Q.delay(200).then(function () {
            return Zanimo(elt)
                .then(Zanimo.f("transform", "translate(200px, 0)", 400))
                .fail(function (err) {
                    setDown1();
                    return expect(err).to.be.a(Error);
                });
        });
    });

    it('succeeded to apply sequentially 4 opacity transitions on the same element', function () {
        var elt = setUp1(),
            transition = Zanimo.f("opacity", 0, 200),
            opacity = function (el) {
                el.style.opacity = 1;
                return el;
            };

        return Q.delay(200).then(function () {
            return Zanimo(elt)
                    .then(transition)
                    .then(opacity)
                    .then(transition)
                    .then(opacity)
                    .then(transition)
                    .then(opacity)
                    .then(transition)
                    .then(setDown1);
        });
    });

    it('succeeded to apply sequentially 4 transform transitions on the same element', function () {

        this.timeout(5000);

        var elt = setUp1(),
            transition = Zanimo.f("transform", "translate(200px, 0)", 500),
            transform = Zanimo.f("transform", "translate(0,0)");

        return Q.when(Q.delay(200), function () {
            return Zanimo(elt)
                    .then(transition)
                    .then(transform)
                    .then(transition)
                    .then(transform)
                    .then(transition)
                    .then(transform)
                    .then(transition)
                    .then(setDown1);
        });
    });

});

window.onload = function () {
    setTimeout(function () { mocha.run(); }, 1000);
};
