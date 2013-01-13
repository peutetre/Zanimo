// Zanimo.js - a tiny css3 transition library
// (c) 2011-2013 Paul Panserrieu

var Zanimo = (function () {

    /**
     * Provides requestAnimationFrame in a cross browser way.
     * @author paulirish / http://paulirish.com/
     */
    if ( !window.requestAnimationFrame ) {
        window.requestAnimationFrame = ( function() {

            return window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
            function( /* function FrameRequestCallback */ callback,
                      /* DOMElement Element */ element ) {
                window.setTimeout( callback, 1000 / 60 );
            };

        } )();
    };

    /*
     * Private helper dealing with prefix and normalizing
     * css properties, transition/transform values.
     */
    var T = (function (doc) {
        var _matchParenthesis = /(\(.+?\))/g,
            _zeropixel = /^0px$/g,
            _zero = "0"
            _space = / /g,
            _normRegex = /\-([a-z])/g,
            _emptyString = "",
            _transitionend = "transitionend",
            _prefix = null,
            _prefixed = { "transform": "" },
            _norm = function (p) {
                var property = p[0] === "-" ? p.substr(1, p.length-1) : p;
                return property.replace(_normRegex,
                    function(m, g) { return g.toUpperCase();});
            },
            _normTransform = function (val) {
                return val.replace(
                    _matchParenthesis,
                    function (match) {
                        var args = match.substr(1, match.length-2).split(","),
                            rst = [];
                        args.forEach(function (arg) {
                            rst.push(arg.replace(_space, _emptyString)
                                        .replace(_zeropixel, _zero));
                        });
                        return "(" + rst.join(",") + ")";
                    }
                );
            };

            // detect transition feature
            if( 'WebkitTransition' in doc.body.style
                && !("OTransition" in doc.body.style) ) {
                _transitionend = 'webkitTransitionEnd';
                _prefix = "webkit";
            }

            // set _prefixed with founded prefix
            for (var p in _prefixed)
                _prefixed[p] = _prefix ? "-" + _prefix + "-" + p : p;

        return {
            // prefixed transition string
            t : _norm(_prefix ? _prefix + "-" + "transition" : "transition"),
            // prefixed transition end event string
            transitionend : _transitionend,
            // normalize css property
            norm : _norm,
            // prefix a css property if needed
            prefix : function (p) {
                return _prefixed[p] ? _prefixed[p] : p;
            },
            // returns a transition representation string
            repr : function (v, d, t) {
                return v + " " + d + "ms " + (t || "linear")
            },
            // normalize a css transformation string like
            // "translate(340px, 0px, 230px) rotate(340deg )"
            // -> "translate(340px,0,230px) rotate(340deg)"
            normTransform : _normTransform
        };
    })(window.document),

    /**
     * Returns a fulfilled promise wrapping the given DOM element.
     */
    Z = function (domElt) {
        return Q.fcall(function () {
            return domElt;
        });
    },

    // private helper to add a transition
    add = function (domElt, attr, value, duration, timing) {
        attr = T.prefix(attr);
        if (domElt.style[T.t]) {
            domElt.style[T.t] = domElt.style[T.t]
                                + ", "
                                + T.repr(attr, duration, timing);
        }
        else {
            domElt.style[T.t] = T.repr(attr, duration, timing);
        }
        domElt.style[T.norm(attr)] = value;
    },

    // private helper to remove a transition
    remove = function (domElt, attr, value, duration, timing) {
        attr = T.prefix(attr);
        var props = domElt.style[T.t].split(", "),
            pos = props.lastIndexOf(T.repr(attr, duration, timing)),
            newProps = props.filter(function (elt, idx) {
                return idx !== pos;
            });
        domElt.style[T.t] = newProps.toString();
    };

    /**
     * Starts a transition on the given DOM element and returns
     * a promise wrapping the DOM element.
     */
    Z.transition = function (domElt, attr, value, duration, timing) {
        var d = Q.defer(),
            timeout,
            cb = function () {
                if (timeout) { clearTimeout(timeout); timeout = null; }
                remove(domElt, attr, value, duration, timing);
                domElt.removeEventListener(T.transitionend, cb, false);
                d.resolve(domElt);
            };

        if (!domElt || !domElt.nodeType || !(domElt.nodeType >= 0)) {
            d.reject(new Error("Zanimo transition: no DOM element!"));
            return d.promise;
        }

        domElt.addEventListener(T.transitionend, cb, false);

        window.requestAnimationFrame(function () {
            // apply the transition
            add(domElt, attr, value, duration, timing);
            // by pass `transitionend` event or reject.
            timeout = setTimeout(function() {
                var domVal = T.normTransform(domElt.style[T.prefix(attr)]),
                    givenVal = T.normTransform(value);
                // if DOM element reflects the given value: success
                if (domVal == givenVal) {
                    cb();
                    d.resolve(domElt);
                    return;
                }
                d.reject(
                    new Error("Zanimo transition: "
                            + domElt.id + " with "
                            + attr + ":" + givenVal
                            + " DOM value: [" + domVal + "]"
                ));
            // giving the browser 20 ms to trigger the `transitionend` event
            }, duration + 20 );
        }, domElt);

        return d.promise;
    };

    /**
     * A function wrapping Zanimo.transition().
     */
    Z.transitionf = function (attr, value, duration, timing) {
        return function (elt) {
            return Z.transition(elt, attr, value, duration, timing);
        };
    };

    /**
     * Apply a CSS3 transform value to a given DOM element
     * and returns a promise wrapping the DOM element.
     */
    Z.transform = function (elt, value, overwrite) {
        var d = Q.defer();
        window.requestAnimationFrame(function () {
            elt.style[T.prefixed["transform"]] =
                overwrite ? elt.style[T.prefixed["transform"]] + value : value;
            d.resolve(elt);
        }, elt);
        return d.promise;
    };

    /**
     * A function wrapping Zanimo.transform().
     */
    Z.transformf = function (value, overwrite) {
        return function (elt) {
            return Z.transform(elt, value, overwrite);
        };
    };

    /**
     * A function wrapping Zanimo().
     */
    Z.f = function (elt) {
        return function () {
            return Z(elt);
        };
    };

    return Z;
})();
