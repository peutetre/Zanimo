// Zanimo.js - Promise based CSS3 transitions
// (c) 2011-2014 Paul Panserrieu

(function (definition) {
    if (typeof exports === "object") {
        module.exports = definition(require("q"), require("qanimationframe"));
    } else {
        window.Zanimo = definition(window.Q, window.QanimationFrame);
    }

})(function (Q, QanimationFrame) {

    /*
     * Private helper dealing with prefix and normalizing
     * css properties, transition/transform values.
     */
    var T = (function (doc) {
        var _matchParenthesis = /(\(.+?\))/g,
            _zeropixel = /^0px$/g,
            _zero = "0",
            _space = / /g,
            _normRegex = /\-([a-z])/g,
            _emptyString = "",
            _transitionend = "transitionend",
            _transition = "transition",
            _prefix = null,
            _dummy = null,
            _dummyTransition = "opacity 100ms linear 0s",
            _repr = function (v, d, t) {
                return v + " " + d + "ms " + (t || "linear");
            },
            _prefixed = { "transform": "" },
            _normReplacef = function(m, g) { return g.toUpperCase(); },
            _normCSSVal = function (match) {
                var args = match.substr(1, match.length-2).split(","), rst = [];
                args.forEach(function (arg) {
                    rst.push(arg.replace(_space, _emptyString).replace(_zeropixel, _zero));
                });
                return "(" + rst.join(",") + ")";
            },
            _norm = function (p) {
                var property = p[0] === "-" ? p.substr(1, p.length-1) : p;
                return property.replace(_normRegex, _normReplacef);
            },
            _normValue = function (val) {
                if (val === null || val === undefined) return "";
                return isNaN(val) ? val.replace(_matchParenthesis, _normCSSVal) : val.toString();
            };

        // detect transition feature
        if( 'WebkitTransition' in doc.body.style ) {
            _transitionend = 'webkitTransitionEnd';
            _prefix = "webkit";
        }

        for (var p in _prefixed)
            _prefixed[p] = _prefix ? "-" + _prefix + "-" + p : p;

        _transition = _prefix ? _prefix + "-" + _transition : _transition;
        _transition = _norm(_transition);
        _dummy = doc.createElement("div");
        _dummyTransition = _normValue(_dummyTransition);
        _dummy.style[_transition] = _dummyTransition;
        _dummy = _normValue(_dummy.style[_transition]);

        if (_dummy === _dummyTransition) {
            _repr = function (v, d, t) {
                return v + " " + d + "ms " + (t || "linear") + " 0s";
            };
        }

        return {
            // prefixed transition string
            t : _transition,
            // prefixed transition end event string
            transitionend : _transitionend,
            // normalize css property
            norm : _norm,
            // prefix a css property if needed
            prefix : function (p) { return _prefixed[p] ? _prefixed[p] : p; },
            repr : _repr,
            // normalize a css transformation string like
            // "translate(340px, 0px, 230px) rotate(340deg )"
            // -> "translate(340px,0,230px) rotate(340deg)"
            normValue : _normValue
        };
    })(window.document),

    isDOM = function (domElt) {
        return domElt && domElt.nodeType ? true : false;
    },

    // private helper to add a transition
    add = function (domElt, attr, value, duration, easing) {
        attr = T.prefix(attr);
        if (domElt.style[T.t]) {
            domElt.style[T.t] = domElt.style[T.t] +
                                ", " +
                                T.repr(attr, duration, easing);
        }
        else {
            domElt.style[T.t] = T.repr(attr, duration, easing);
        }
        domElt.style[T.norm(attr)] = value;
    },

    // private helper to remove a transition
    remove = function (domElt, attr/*, value, duration, easing*/) {
        var keys = [];
        for (var k in domElt._zanimo) {
            keys.push(k);
        }
        if(keys.length === 1 && keys[0] === attr) domElt.style[T.t] = "";
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
        if (arity === 0 || arity === 2 || arity > 5) throw new Error("Zanimo: invalid arguments.");
        if (Q.isPromise(elt)) {
            return elt.then(function (elt) {
                return Zanimo.apply(this, [elt].concat(Array.prototype.slice.call(arguments, 1)));
            });
        }
        if (!isDOM(elt)) {
            throw new Error("Zanimo require an HTMLElement, or a promise of an HTMLElement");
        }
        if (arity === 1) {
            return Q(elt);
        }
        else if (arity === 3) {
            var prefixedAttr = T.prefix(attr);
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
                throw new Error("Zanimo transition: duration must be an integer!");
            }

            var d = Q.defer(), timeout,
                cb = function (clear) {
                    if (timeout) { clearTimeout(timeout); timeout = null; }
                    remove(elt, attr, value, duration, easing);
                    elt.removeEventListener(T.transitionend, cbTransitionend);
                    if (clear) { delete elt._zanimo[attr]; }
                },
                cbTransitionend = function (evt) {
                    if(T.norm(evt.propertyName) === T.norm(T.prefix(attr))) {
                        cb(true);
                        d.resolve(elt);
                    }
                };

            elt.addEventListener(T.transitionend, cbTransitionend);

            QanimationFrame(function () {
                add(elt, attr, value, duration, easing);
                timeout = setTimeout(function () {
                    var rawVal = elt.style.getPropertyValue(T.prefix(attr)),
                        domVal = T.normValue(rawVal),
                        givenVal = T.normValue(value);

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

    Zanimo._T = T;

    return Zanimo;

});
