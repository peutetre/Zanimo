// Zanimo.js - a tiny css3 transition library
// (c) 2011-2012 Paul Panserrieu

var Zanimo = (function () {

    var T = (function (doc) {
        var transitionend = "transitionend",
            prefix = null,
            prefixed = { "transform": "transform" },
            properties = {
                property : "TransitionProperty",
                duration : "TransitionDuration",
                timing : "TransitionTimingFunction"
            },
            norm = function (p) {
                var property = p[0] === "-" ? p.substr(1, attr.length-1) : p;
                return property.replace(/\-([a-z])/g, function(m, g) { return g.toUpperCase();});
            };

            if('WebkitTransition' in doc.body.style) {
                transitionend = 'webkitTransitionEnd'; prefix = "webkit";
            }

            for (var property in prefixed)
                prefixed[property] = prefix ? prefix + "-" + prefixed[property] : prefixed[property];

            for (var p in properties)
                properties[p] = prefix ? prefix + properties[p] : properties[p].charAt(0).toLowerCase() + properties[p].slice(1);

        return {
            transition : norm(prefix ? prefix + "-" + "transition": "transition"),
            transitionend : transitionend,
            properties:properties,
            norm:norm,
            prefixProperty : function (p) {
                return prefixed[p] ? prefixed[p] : p;
            }
        };
    })(window.document),

    Z = function (domElt) {
        return Q.fcall(function () {
            return domElt;
        });
    },

    add = function (domElt, attr, value, duration, timing) {
        attr = T.prefixProperty(attr);
        if (domElt.style[T.properties.property]) {
            domElt.style[T.properties.property] = domElt.style[T.properties.property] + ", " + attr;
            domElt.style[T.properties.duration] = domElt.style[T.properties.duration] + ", " + duration + "ms";
            domElt.style[T.properties.timing] = domElt.style[T.properties.timing] + ", " + (timing || "linear");
        }
        else {
            domElt.style[T.properties.property] = attr;
            domElt.style[T.properties.duration] = duration + "ms";
            domElt.style[T.properties.timing] = (timing || "linear");
        }
        domElt.style[T.norm(attr)] = value;
    },

    remove = function (domElt, attr, value, duration, timing) {
        attr = T.prefixProperty(attr);
        var props = domElt.style[T.transition].split(", "),
            pos = props.lastIndexOf(attr + " " + duration + "ms " + (timing || "linear")),
            newProps = props.filter(function (elt, idx) { return idx !== pos; });
        domElt.style[T.transition] = newProps.toString();
    };

    Z.kDelta = 140;
    Z.kMin = 140;

    Z.transition = function (domElt, attr, value, duration, timing) {
        var d = Q.defer(),
            timeout,
            cb = function (evt) {
                if (timeout) { clearTimeout(timeout); timeout = null; }
                d.resolve(domElt);
                remove(domElt, attr, value, duration, timing);
                domElt.removeEventListener(T.transitionend, cb, false);
            };

        if (!domElt || !domElt.nodeType || !(domElt.nodeType >= 0)) {
            d.reject(new Error("Zanimo transition: no given dom Element!"));
            return d.promise;
        }

        domElt.addEventListener(T.transitionend, cb, false);

        timeout = setTimeout(function() {
            d.reject(new Error("Zanimo transition: " + domElt.id + " with " + attr + ":" + value));
        }, duration > Z.kMin ? duration + Z.kDelta : Z.kMin);

        setTimeout(function () { add(domElt, attr, value, duration, timing); }, 0);
        return d.promise;
    };

    return Z;
})();