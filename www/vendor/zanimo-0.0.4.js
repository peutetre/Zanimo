// Zanimo.js - Promise based CSS3 transitions
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
            _normReplacef = function(m, g) { return g.toUpperCase(); },
            _normTransf = function (match) {
                var args = match.substr(1, match.length-2).split(","),
                    rst = [];
                args.forEach(function (arg) {
                    rst.push(arg.replace(_space, _emptyString)
                                .replace(_zeropixel, _zero));
                });
                return "(" + rst.join(",") + ")";
            },
            _norm = function (p) {
                var property = p[0] === "-" ? p.substr(1, p.length-1) : p;
                return property.replace(_normRegex, _normReplacef);
            },
            _normTransform = function (val) {
                return isNaN(val) ?
                    val.replace(_matchParenthesis, _normTransf) : "" + val;
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
            // transform attr
            transform : _norm(_prefixed["transform"]),
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
        if (domElt instanceof HTMLElement) return Q.resolve(domElt);
        else return Q.reject(new Error("Zanimo require an HTMLElement"));
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
        var d = Q.defer(), timeout,
            cb = function () {
                if (timeout) { clearTimeout(timeout); timeout = null; }
                remove(domElt, attr, value, duration, timing);
                domElt.removeEventListener(T.transitionend, cb, false);
            },
            cbTransitionend = function () { cb(); d.resolve(domElt); };

        if (!(domElt instanceof HTMLElement)) {
            d.reject(new Error("Zanimo transition: no DOM element!"));
            return d.promise;
        }

        if(window.isNaN(parseInt(duration, 10))) {
            d.reject(new Error("Zanimo transition: duration must be an integer!"));
            return d.promise;
        }

        domElt.addEventListener(T.transitionend, cbTransitionend, false);

        window.requestAnimationFrame(function () {
            add(domElt, attr, value, duration, timing);
            timeout = setTimeout(function () {
                var rawVal = domElt.style.getPropertyValue(T.prefix(attr)),
                    domVal = T.normTransform(rawVal),
                    givenVal = T.normTransform(value);
                if (domVal === givenVal) {
                    d.resolve(domElt);
                }
                else {
                    d.reject( new Error("Zanimo transition: "
                        + domElt.id + " with " + attr + " = " + givenVal
                        + ", DOM value=" + domVal
                    ));
                }
                cb();
            }, duration + 20 );

            domElt._zanimo = domElt._zanimo || { };
            if(domElt._zanimo[attr]) {
                domElt._zanimo[attr].defer.reject(new Error("Zanimo transition "
                    + domElt.id + " with "
                    + attr + "=" + domElt._zanimo[attr].value
                    + " stopped by transition with " + attr + "=" + value
                ));
                domElt._zanimo[attr].cb();
            }
            domElt._zanimo[attr] = {cb: cb, value: value, defer: d};

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

        if (!(elt instanceof HTMLElement)) {
            d.reject(new Error("Zanimo transform: no DOM element!"));
            return d.promise;
        }

        if(elt._zanimo && elt._zanimo.hasOwnProperty("transform")) {
            elt._zanimo["transform"].defer.reject(new Error(
                "Zanimo transition " + elt.id + " with transform="
                + elt._zanimo["transform"].value
                + " stopped by transform=" + value
            ));
            elt._zanimo["transform"].cb();
        }

        window.requestAnimationFrame(function () {
            elt.style[T.transform] =
                !overwrite ? elt.style[T.transform] + " " + value : value;
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

    Z._T = T;

    return Z;
})();
