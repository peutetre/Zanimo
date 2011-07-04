var Zanimo = (function () {
 
    var kDelta = 20; 

    function _set(domElt, property, newValue) {
        var prop = domElt.style[property];
        domElt.style[property] = (prop.length > 0) ? (prop + ", " + newValue) : newValue;
    }

    var Z = function (domElt) {
        var d = Zanimo.async.defer();
        d.resolve(domElt);
        return d.promise;
    };

    Z.delay = function (ms) {
        var d = Zanimo.async.defer();
        setTimeout(function () { d.resolve(ms); }, ms);
        return d.promise;
    };

    Z.transition = function (domElt, attr, value, duration, timing) {
        var d = Zanimo.async.defer(),
                done = false;

        var cb = function (evt) {
            done = true;
            d.resolve(domElt);
            domElt.removeEventListener(
                "webkitTransitionEnd",
                cb
            );
        };

        domElt.addEventListener( "webkitTransitionEnd", cb);

        Zanimo.delay(duration + kDelta).then(
            function () {
                if (!done) {
                    d.resolve(Zanimo.async.reject("Transition error."));
                }
            }
        );

        _set(domElt, "webkitTransitionDuration", duration + "ms");
        _set(domElt, "webkitTransitionProperty", attr);
        _set(domElt, "webkitTransitionTimingFunction", timing || "linear");

        domElt.style.cssText += ";" + attr + ":" + value;
        return d.promise;
    };

    return Z;
})();
