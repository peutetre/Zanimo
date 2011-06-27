var Zanimo = (function () {
 
    var kDelta = 40; 

    function _set(domElt, property, newValue) {
        domElt.style[property] = (domElt.style[property].length > 0) 
                                 ? (domElt.style[property] + ", " + newValue) 
                                 : newValue;
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

        Zanimo.async.enqueue(function () {
            var cb = function (evt) {
                done = true;
                console.log(d);
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
                        Zanimo.async.reject("Transition Error: ");
                        throw new Error("Transition Error: " + domElt.id + " " + attr );
                    } 
                }
            );

            _set(domElt, "webkitTransitionDuration", duration + "ms");
            _set(domElt, "webkitTransitionProperty", attr);
            _set(domElt, "webkitTransitionTimingFunction", timing || "linear");

            domElt.style.cssText += ";" + attr + ":" + value;
        });
        return d.promise;
    };

    return Z;
})();
