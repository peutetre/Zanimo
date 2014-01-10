// Zanimo.js - Promise based CSS3 transitions
// (c) 2011-2014 Paul Panserrieu

'use strict';

var Q = require('q'),
    QanimationFrame = require('qanimationframe'),
    prefix = require('vendor-prefix'),
    normalizeTransformValue = require('../src/normalize-transform-value'),
    shorthand = require('../src/transition-shorthand-property'),
    transition = prefix('transition'),
    transitionend = 'WebkitTransition' in document.body.style ? 'webkitTransitionEnd' : 'transitionend',

    isDOM = function (el) { return el && el.nodeType; },

    addTransition = function (elt, attr, value, duration, easing) {
        var currentValue = elt.style[transition];
        attr = prefix.dash(attr);
        if (currentValue) {
            elt.style[transition] = currentValue + ", " + shorthand(attr, duration, easing);
        }
        else {
            elt.style[transition] = shorthand(attr, duration, easing);
        }
        elt.style[prefix(attr)] = value;
    },

    removeTransition = function (el, attr) {
        el.style[transition] = el.style[transition]
            .split(',').filter(function(t) {
                return !t.match(attr);
            }).join(',');
    },

    applycss = function (el, attr, value) {
        return QanimationFrame(function(){
            el.style[prefix.dash(attr)] = value;
            return el;
        });
    },

    css = function (el, attr, value) {
        if(el._zanimo && el._zanimo.hasOwnProperty(attr)) {
            el._zanimo[attr].defer.reject(new Error(
                "Zanimo transition with transform=" +
                el._zanimo[attr].value +
                " stopped by transform=" + value
            ));
            el._zanimo[attr].cb();
        }
        return applycss(el, attr, value);
    },

    animate = function (el, attr, value, duration, easing) {
        var prefixed = prefix.dash(attr),
            d = Q.defer(),
            timeout,
            cb = function (clear) {
                if (timeout) { clearTimeout(timeout); timeout = null; }
                removeTransition(el, attr);
                el.removeEventListener(transitionend, cbTransitionend);
                if (clear) { delete el._zanimo[attr]; }
            },
            cbTransitionend = function (evt) {
                if(prefix(evt.propertyName) === prefix(prefixed)) {
                    cb(true);
                    d.resolve(el);
                }
            };

        el.addEventListener(transitionend, cbTransitionend);

        QanimationFrame(function () {
            addTransition(el, attr, value, duration, easing);
            timeout = setTimeout(function () {
                var rawVal = el.style.getPropertyValue(prefixed),
                    domVal = normalizeTransformValue(rawVal),
                    givenVal = normalizeTransformValue(value);

                cb(true);
                if (domVal === givenVal) { d.resolve(el); }
                else {
                    d.reject( new Error("Zanimo transition: with "
                        + attr + " = " + givenVal + ", DOM value=" + domVal
                    ));
                }
            }, duration + 20 );

            el._zanimo = el._zanimo || { };
            if(el._zanimo[attr]) {
                el._zanimo[attr].defer.reject(new Error(
                    "Zanimo transition with " +
                    attr + "=" + el._zanimo[attr].value +
                    " stopped by transition with " + attr + "=" + value
                ));
                el._zanimo[attr].cb();
            }
            el._zanimo[attr] = {cb: cb, value: value, defer: d};
        });

        return d.promise;
    };

/**
 * Zanimo(el)
 * > Returns a Promise of elt.
 *
 * Zanimo(el, attr, value)
 * > Sets el.style[attr]=value and returns the Promise of el.
 *
 * Zanimo(el, attr, value, duration)
 * Zanimo(el, attr, value, duration, easing)
 * > Performs a transition.
 */
var Zanimo = function (el, attr, value, duration, easing) {
    var arity = arguments.length;
    if (arity === 0 || arity === 2 || arity > 5) return Q.reject(new Error("Zanimo invalid arguments"));
    if (Q.isPromise(el)) {
        return el.then(function (el) {
            return Zanimo.apply(this, [el].concat(Array.prototype.slice.call(arguments, 1)));
        });
    }
    if (!isDOM(el)) {
        return Q.reject(new Error("Zanimo require an HTMLElement, or a promise of an HTMLElement"));
    }
    if (arity === 1) {
        return Q(el);
    }
    try {
        prefix.dash(attr);
    } catch(err) {
        return Q.reject(new Error("Zanimo transition: " + attr + ' is not supported!'));
    };
    if (arity === 3) {
        return css(el, attr, value);
    }
    if(window.isNaN(parseInt(duration, 10))) {
        return Q.reject(new Error("Zanimo transition: duration must be an integer!"));
    }
    return animate(el, attr, value, duration, easing);
};

/**
 * A function wrapping `Zanimo(elt, ...)` as a `f(...)(elt)` for easy chaining purpose.
 */
Zanimo.f = function (attr, value, duration, easing) {
    var args = Array.prototype.slice.call(arguments);
    return function (elt) {
        return Zanimo.apply(this, [elt].concat(args));
    };
};

module.exports = Zanimo;
