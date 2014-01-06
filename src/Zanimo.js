// Zanimo.js - Promise based CSS3 transitions
// (c) 2011-2014 Paul Panserrieu

'use strict';

var Q = require('q'),
    QanimationFrame = require('qanimationframe'),
    prefix = require('prefix'),
    normalizeTransformValue = require('../src/normalize-transform-value'),
    shorthand = require('../src/transition-shorthand-property'),

    transition = prefix('transition'),
    transitionend = 'WebkitTransition' in document.body.style ? 'webkitTransitionEnd' : 'transitionend';

var isDOM = function (domElt) { return domElt && domElt.nodeType; },

// private helper to add a transition
add = function (domElt, attr, value, duration, easing) {
    attr = prefix.dash(attr);
    if (domElt.style[transition]) {
        domElt.style[transition] = domElt.style[transition] +
                            ", " +
                            shorthand(attr, duration, easing);
    }
    else {
        domElt.style[transition] = shorthand(attr, duration, easing);
    }
    domElt.style[prefix(attr)] = value;
},

// private helper to remove a transition
remove = function (domElt, attr/*, value, duration, easing*/) {
    var keys = [];
    for (var k in domElt._zanimo) {
        keys.push(k);
    }
    if(keys.length === 1 && keys[0] === attr) domElt.style[transition] = "";
};

/**
 * Zanimo(elt)
 * > Returns a Promise of elt.
 *
 * Zanimo(elt, attr, value)
 * > Sets elt.style[attr]=value and returns the Promise of elt.
 *
 * Zanimo(elt, attr, value, duration)
 * Zanimo(elt, attr, value, duration, easing)
 * > Performs a transition.
 */
var Zanimo = function (elt, attr, value, duration, easing) {
    var arity = arguments.length;
    if (arity === 0 || arity === 2 || arity > 5) return Q.reject(new Error("Zanimo: invalid arguments"));
    if (Q.isPromise(elt)) {
        return elt.then(function (elt) {
            return Zanimo.apply(this, [elt].concat(Array.prototype.slice.call(arguments, 1)));
        });
    }
    if (!isDOM(elt)) {
        return Q.reject(new Error("Zanimo require an HTMLElement, or a promise of an HTMLElement"));
    }
    if (arity === 1) {
        return Q(elt);
    }
    else if (arity === 3) {
        try {
            var prefixedAttr = prefix.dash(attr);
        } catch(err) {
            return Q.reject(new Error("Zanimo transition: " + attr + ' is not supported!'));
        };
        if(elt._zanimo && elt._zanimo.hasOwnProperty(attr)) {
            elt._zanimo[attr].defer.reject(new Error(
                "Zanimo transition " + elt.id + " with transform=" +
                elt._zanimo[attr].value +
                " stopped by transform=" + value
            ));
            elt._zanimo[attr].cb();
        }
        return QanimationFrame(function(){
            elt.style[prefixedAttr] = value;
            return elt;
        });
    }
    else {
        if(window.isNaN(parseInt(duration, 10))) {
            return Q.reject(new Error("Zanimo transition: duration must be an integer!"));
        }
        try {
            var prefixedAttr = prefix.dash(attr);
        } catch(err) {
            return Q.reject(new Error("Zanimo transition: " + attr + ' is not supported!'));
        };
        var d = Q.defer(), timeout,
            cb = function (clear) {
                if (timeout) { clearTimeout(timeout); timeout = null; }
                remove(elt, attr, value, duration, easing);
                elt.removeEventListener(transitionend, cbTransitionend);
                if (clear) { delete elt._zanimo[attr]; }
            },
            cbTransitionend = function (evt) {
                if(prefix(evt.propertyName) === prefix(prefixedAttr)) {
                    cb(true);
                    d.resolve(elt);
                }
            };

        elt.addEventListener(transitionend, cbTransitionend);

        QanimationFrame(function () {
            add(elt, attr, value, duration, easing);
            timeout = setTimeout(function () {
                var rawVal = elt.style.getPropertyValue(prefixedAttr),
                    domVal = normalizeTransformValue(rawVal),
                    givenVal = normalizeTransformValue(value);

                cb(true);
                if (domVal === givenVal) { d.resolve(elt); }
                else {
                    d.reject( new Error("Zanimo transition: " +
                        elt.id + " with " + attr + " = " + givenVal +
                        ", DOM value=" + domVal
                    ));
                }
            }, duration + 20 );

            elt._zanimo = elt._zanimo || { };
            if(elt._zanimo[attr]) {
                elt._zanimo[attr].defer.reject(new Error(
                    "Zanimo transition " +
                    elt.id + " with " +
                    attr + "=" + elt._zanimo[attr].value +
                    " stopped by transition with " + attr + "=" + value
                ));
                elt._zanimo[attr].cb();
            }
            elt._zanimo[attr] = {cb: cb, value: value, defer: d};
        });

        return d.promise;
    }
};

/**
 * A function wrapping `Zanimo(elt, ...)` as a `f(...)(elt)` for easy chaining purpose.
 */
Zanimo.f = function (/*attr, value, duration, easing*/) {
    var args = Array.prototype.slice.call(arguments);
    return function (elt) {
        return Zanimo.apply(this, [elt].concat(args));
    };
};

module.exports = Zanimo;
