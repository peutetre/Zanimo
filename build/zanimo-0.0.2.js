// Zanimo.js - a tiny css3 transition library
// (c) 2011-2012 Paul Panserrieu

var Zanimo = (function () {

    var Z = function (domElt) {
            var d = Q.defer();
            d.resolve(domElt);
            return d.promise;
        };

    Z.kDelta = 140;

    Z.when = Q.when;

    Z.delay = function (ms, domElt) {
        var d = Q.defer();
        setTimeout(function () { d.resolve(domElt || ms); }, ms);
        return d.promise;
    };

    Z._addTransition = function (domElt, attr, value, duration, timing) {
        attr = attr === "transform" ? "-webkit-transform" : attr;
        if (domElt.style.webkitTransitionProperty) {
            domElt.style.webkitTransitionProperty = domElt.style.webkitTransitionProperty + ", " + attr;
            domElt.style.webkitTransitionDuration = domElt.style.webkitTransitionDuration + ", " + duration + "ms";
            domElt.style.webkitTransitionTimingFunction = domElt.style.webkitTransitionTimingFunction + ", " + (timing || "linear");
        }
        else {
            domElt.style.webkitTransitionProperty = attr;
            domElt.style.webkitTransitionDuration = duration + "ms";
            domElt.style.webkitTransitionTimingFunction = (timing || "linear");
        }
        attr = attr[0] === "-" ? attr.substr(1, attr.length-1) : attr;
        attr = attr.replace(/(\-[a-z])/g, function(m) { return m.toUpperCase().replace('-','');} );
        domElt.style[attr] = value;
    };

    Z._removeTransition = function (domElt, attr, value, duration, timing) {
        attr = attr === "transform" ? "-webkit-transform" : attr;
        var props = domElt.style.webkitTransition.split(", "),
            pos = props.lastIndexOf(attr + " " + duration + "ms " + (timing || "linear")),
            newProps = props.filter(function (elt, idx) { return idx !== pos; });

        domElt.style.webkitTransition = newProps.toString();
    };

    Z.transition = function (domElt, attr, value, duration, timing) {
        var d = Q.defer(),
            timeout,
            cb = function (evt) {
                if (timeout) { clearTimeout(timeout); timeout = null; }
                d.resolve(domElt);
                Z._removeTransition(domElt, attr, value, duration, timing);
                domElt.removeEventListener("webkitTransitionEnd", cb, false);
            };

        if (!domElt || !domElt.nodeType || !(domElt.nodeType >= 0)) {
            d.reject(new Error("Zanimo transition: no given dom Element!"));
            return d.promise;
        }

        domElt.addEventListener("webkitTransitionEnd", cb, false);

        timeout = setTimeout(function() {
            d.reject(new Error("Zanimo transition: " + domElt.id + " with " + attr + ":" + value));
        }, duration + Z.kDelta);

        Z._addTransition(domElt, attr, value, duration, timing);
        return d.promise;
    };

    return Z;
})();
