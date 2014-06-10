/*
 * test.js
 */

'use strict';

var normalizeTransformValue = require('../src/normalize-transform-value'),
    normalizeTimingFunction = require('../src/normalize-timing-function'),
    Zanimo = require('..'),
    Q = require('q'),
    prefix = require('vendor-prefix'),
    expect = require('expect.js'),
    $test = document.getElementById('test');

Q.longStackSupport = true;

function createSquare(id) {
    var el = document.createElement("div");
    el.id = id;
    el.style.width = "100px";
    el.style.height = "100px";
    el.style.backgroundColor = "red";
    $test.appendChild(el);
    return el;
};

function removeSquare(id) {
    $test.removeChild(document.getElementById(id));
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
    it('should return `red` when called with `red`', function () {
        expect(normalizeTransformValue('red')).to.eql('red');
    });
    it('should return `#1ABC9C` when called with `#1ABC9C`', function () {
        expect(normalizeTransformValue('#1ABC9C')).to.eql('#1ABC9C');
    });
    it('should return `rgba(25,25,25,0.5)` when called with `rgba(25, 25, 25, .5)`', function () {
        expect(normalizeTransformValue('rgba(25, 25, 25, .5)')).to.eql('rgba(25,25,25,0.5)');
    });
    it('should return `rgb(19,32,20)` when called with `hsl(125, 25%, 10%)`', function () {
        expect(normalizeTransformValue('hsl(125, 25%, 10%)')).to.eql('rgb(19,32,20)');
    });
    it('should return `rgba(221,232,238,0.5)` when called with `hsla(200, 35%, 90%, .5)`', function () {
        expect(normalizeTransformValue('hsla(200, 35%, 90%, .5)')).to.eql('rgba(221,232,238,0.5)');
    });
});

describe('normalizeTimingFunction', function () {
    it('should return "linear" when called with "linear"', function () {
        expect(normalizeTimingFunction('linear')).to.eql('linear');
    });
    it('should return "cubic-bezier(0.17, .67, .83, .67)" when called with "cubic-bezier(0.17,0.67,0.83,0.67)"', function () {
        expect(normalizeTimingFunction('cubic-bezier(0.17, .67, .83, .67)')).to.eql('cubic-bezier(0.17,0.67,0.83,0.67)');
    });
    it('should return "cubic-bezier(.17, .67 , .83, .67 )" when called with "cubic-bezier(0.17,0.67,0.83,0.67)"', function () {
        expect(normalizeTimingFunction('cubic-bezier(.17, .67 , .83, .67 )')).to.eql('cubic-bezier(0.17,0.67,0.83,0.67)');
    });
});

describe('Zanimo', function () {

    it('rejects with no DOM element', function () {
        return Zanimo('Oops')
            .fail(function (err) {
                expect(err).to.be.a(Error);
            });
    });

    it('succeeded with a DOM element', function () {
        var el = setUp1();

        return Zanimo(el)
            .then(function (el) {
                expect(el).to.be.a(window.Element);
                setDown1();
            });
    });

    it('succeeded with a promise of a DOM element', function () {
        var el = setUp1(),
            d = Q.defer();

        setTimeout(function () {
            d.resolve(el);
        }, 200);

        return Zanimo(d.promise)
            .then(function (val) {
                expect(val).to.eql(el);
                setDown1();
            });
    });

    it('failed with a promise of number', function () {
        return Zanimo(Q(1))
            .fail(function (err) {
                return expect(err).to.be.a(Error);
            });
    });

    it('succeeded applying a style to an element', function () {
        var el = setUp1();

        return Zanimo(el).then(Zanimo.f('opacity', 0)).then(function (el) {
            expect(el.style.opacity).to.eql("0");
            setDown1();
        });
    });

    it('succeeded applying a style to an element wrapped in a promise', function () {
        var el = setUp1();

        return Zanimo(Q.resolve(el), 'opacity', 0).then(function (el) {
            expect(el.style.opacity).to.eql("0");
            setDown1();
        });
    });

    it('succeeded transitioning the width of a element from 100px to 300px in 400ms with ease-in-out timing function', function() {
        var el = setUp1();

        return Q.delay(200).then(function () {

            expect(el.style.width).to.eql('100px');

            return Zanimo(el, "width", "300px", 400, "ease-in-out")
                .then(function (el) {
                    expect(el.style.width).to.eql('300px');
                    setDown1();
                });
        });

     });

    it('succeeded transitioning the width and height of a element from 100px to 300px in 400ms with ease-in-out timing function', function() {
        var el = setUp1();

        expect(el.style.width).to.eql('100px');
        expect(el.style.height).to.eql('100px');

        return  Q.allSettled([
                Zanimo(el, "width", "300px", 400, "ease-in-out"),
                Zanimo(el, "height", "300px", 400, "ease-in-out")
            ])
            .then(function (els) {
                expect(els[0].value.style.width).to.eql('300px');
                expect(els[0].value.style.height).to.eql('300px');
                setDown1();
            });

     });

    it('succeeded chaining of 2 transitions with 2 elements', function () {
        var el1 = setUp1(),
            el2 = setUp2(),
            down = function (r) {
                setDown1();
                return setDown2(r);
            };

       return Zanimo(el1, "transform", "translate(200px, 0)", 300)
            .then(function () {
                expect(normalizeTransformValue(el1.style[prefix('transform')])).to.be.eql('translate(200px,0)');
                return Zanimo(el2, "transform", "translate(0, 200px)", 100);
            })
            .then(function (el) {
                expect(normalizeTransformValue(el.style[prefix('transform')])).to.be.eql('translate(0,200px)');
                down();
            });
    });

    it('failed when called with not a DOM element', function () {
        return Zanimo("Oops", "opacity", 1, 100)
            .fail(function (err) {
                return expect(err).to.be.a(Error);
            });
    });

    it('failed when called with a wrong transition property', function () {
        var el = setUp1();

        return Zanimo(el, "toto", "test", 100)
            .fail(function (err) {
                setDown1();
                return expect(err).to.be.a(Error);
            });
    });

    it('failed when called with a wrong time value', function () {
        var el = setUp1();

        return Zanimo(el, "opacity", 0.5, "oops", "linear")
            .fail(function (err) {
                setDown1();
                return expect(err).to.be.a(Error);
            });
    });

    it('succeeded while setting the transform css property of an element to `translate(200px, 0)`', function () {
        var el = setUp1();
        return Zanimo(el, "transform", "translate(200px, 0)").then(setDown1);
    });

    it('succeeded while making a transition on the background color to hsla(200, 35%, 90%, .5)', function () {
        var el = setUp1();
        return Zanimo(el, "background-color", "hsla(200, 35%, 90%, .5)", 200, 'ease-in-out').then(setDown1);
    });

    it('succeeded while making a transition on the background color to rgba(19, 32, 20, 0.5)', function () {
        var el = setUp1();
        return Zanimo(el, "background-color", "rgba(19, 32, 20, 0.5)", 200, 'ease-in-out').then(setDown1);
    });

});

describe('Zanimo.f', function () {

    it('succeeded transitioning the opacity of an element from 1 to 0 in 200ms', function () {
        var el = setUp1();

        return Zanimo(el)
            .then(Zanimo.f("opacity", 0, 200))
            .then(setDown1);
    });

    it('failed when trying to perform a transition on the display css property', function () {
        var el = setUp1();

        return Zanimo(el)
            .then(Zanimo.f("display", 1, 100))
            .fail(function (err) {
                setDown1();
                return expect(err).to.be.a(Error);
            });
    });

    it('succeeded transitioning the transform property of an element from nothing to `translate(200px, 0)` in 200ms', function () {
        var el = setUp1();

        return Zanimo(el)
            .then(Zanimo.f("transform", "translate(200px, 0)", 200))
            .then(setDown1);
    });

    it('succeeded transitioning the background-color property of an element from red to blue in 200ms', function () {
        var el = setUp1();

        return Zanimo(el)
            .then(Zanimo.f('background-color', 'blue', 200))
            .then(setDown1);
    });

    it('failed on the first call when called 2 times on the same element on the same css property', function () {
        var el = setUp1(),
            transition1 = Zanimo.f("transform", "translate(200px, 0)", 400),
            transition2 = Zanimo.f("transform", "translate(100px, 300px)", 100);

        Zanimo(el).delay(100).then(transition2).fail(function () {});

        return Zanimo(el)
            .then(transition1)
            .fail(function (err) {
                setDown1();
                return expect(err).to.be.a(Error);
            });
    });

    it('succeeded when called on an element already in transition from another Zanimo call with the same css property', function () {
        var el = setUp1(),
            transition1 = Zanimo.f("transform", "translate(200px, 0)", 400),
            transition2 = Zanimo.f("transform", "translate(100px, 300px)", 100);

        Zanimo(el).then(transition1).fail(function () {});

        return Zanimo(el)
            .delay(100)
            .then(transition2)
            .then(setDown1);
    });

    it('succeeded a css transform on an element already in a Zanimo transition', function () {
        var el = setUp1();

        Zanimo(el).then(Zanimo.f("transform", "translate(200px, 0)", 400)).fail(function () {});

        return Zanimo(el, "transform", "translate(00px, 200px)")
            .then(setDown1);
    });

    it('failed to perform a transition on a element if a transform with the same property is applied during the animation', function () {
        var el = setUp1();

        Zanimo(el).delay(300).then(Zanimo.f("transform", "translate(00px, 200px)")).fail(function () {});

        return Zanimo(el)
            .then(Zanimo.f("transform", "translate(200px, 0)", 400))
            .fail(function (err) {
                setDown1();
                return expect(err).to.be.a(Error);
            });
    });

    it('succeeded to apply sequentially 4 opacity transitions on the same element', function () {
        this.timeout(5000);

        var el = setUp1(),
            transition = Zanimo.f("opacity", 0, 200),
            opacity = function (el) {
                el.style.opacity = 1;
                return el;
            };

        return Zanimo(el)
            .then(transition)
            .then(opacity)
            .then(transition)
            .then(opacity)
            .then(transition)
            .then(opacity)
            .then(transition)
            .then(setDown1);
    });

    it('succeeded to apply sequentially 4 transform transitions on the same element', function () {

        this.timeout(5000);

        var el = setUp1(),
            transition = Zanimo.f("transform", "translate(200px, 0)", 500),
            transform = Zanimo.f("transform", "translate(0,0)");

        return Zanimo(el)
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

window.onload = function () {
    setTimeout(function () { mocha.run(); }, 1000);
};
