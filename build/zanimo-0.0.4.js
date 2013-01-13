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

    /**
     * set up
     */
    var T = (function (doc) {
        var transitionend = "transitionend",
            prefix = null,
            prefixed = { "transform": "transform" },
            norm = function (p) {
                var property = p[0] === "-" ? p.substr(1, p.length-1) : p;
                return property.replace(/\-([a-z])/g,
                    function(m, g) { return g.toUpperCase();});
            },
            _matchParenthesis = /(\(.+?\))/g,
            _zeropixel = /^0px$/g,
            _zero = "0"
            _space = / /g,
            _emptyString = "",
            normTransform = function (val) {
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
            if('WebkitTransition' in doc.body.style && !("OTransition" in doc.body.style)) {
                transitionend = 'webkitTransitionEnd'; prefix = "webkit";
            }

            for (var p in prefixed)
                prefixed[p] = prefix ? "-" + prefix + "-" + prefixed[p] : prefixed[p];

        return {
            transition : norm(prefix ? prefix + "-" + "transition" : "transition"),
            transitionend : transitionend,
            norm : norm,
            prefixProperty : function (p) { return prefixed[p] ? prefixed[p] : p; },
            repr : function (a, d, t) { return a + " " + d + "ms " + (t || "linear") },
            normTransform : normTransform
        };
    })(window.document),

    Z = function (domElt) {
        return Q.fcall(function () {
            return domElt;
        });
    },

    add = function (domElt, attr, value, duration, timing) {
        attr = T.prefixProperty(attr);
        if (domElt.style[T.transition]) {
            domElt.style[T.transition] = domElt.style[T.transition] + ", " + T.repr(attr, duration, timing);
        }
        else {
            domElt.style[T.transition] = T.repr(attr, duration, timing);
        }
        domElt.style[T.norm(attr)] = value;
    },

    remove = function (domElt, attr, value, duration, timing) {
        attr = T.prefixProperty(attr);
        var props = domElt.style[T.transition].split(", "),
            pos = props.lastIndexOf(T.repr(attr, duration, timing)),
            newProps = props.filter(function (elt, idx) { return idx !== pos; });
        domElt.style[T.transition] = newProps.toString();
    };

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
            add(domElt, attr, value, duration, timing);
            timeout = setTimeout(function() {
                var domVal = T.normTransform(domElt.style[T.prefixProperty(attr)]),
                    givenVal = T.normTransform(value);
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
            }, duration + 20 );
        }, domElt);

        return d.promise;
    };

    Z.transitionf = function (attr, value, duration, timing) {
        return function (elt) {
            return Z.transition(elt, attr, value, duration, timing);
        };
    };

    Z.transform = function (elt, value) {
        var d = Q.defer();
        window.requestAnimationFrame(function () {
            elt.style[T.prefixed["transform"]] = value;
            d.resolve(elt);
        }, elt);
        return d.promise;
    };

    Z.transformf = function (value) {
        return function (elt) {
            return Z.transform(elt, value);
        };
    };

    Z.f = function (elt) {
        return function () {
            return Z(elt);
        };
    };

    return Z;
})();
