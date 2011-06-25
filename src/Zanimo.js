var Zanimo = (function () {
 
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

    Z.width = function (len) {
        return function (domElt) {
            domElt.style.width = len + "px";
        }
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

            domElt.addEventListener(
                "webkitTransitionEnd",
                cb
            );
            Zanimo.delay(duration + 40).then(
                function () { if (!done) {
                    Zanimo.async.reject("Transition Error: ");
                    throw new Error("Transition Error: " + domElt.id + " " + attr );
                } }
            );
           if (domElt.style.webkitTransitionDuration.length === 0) {
                domElt.style.webkitTransitionDuration = duration + "ms";
           }
           else {
            domElt.style.webkitTransitionDuration += ", " +  duration + "ms";
           }

           if (domElt.style.webkitTransitionProperty.length === 0) {
                domElt.style.webkitTransitionProperty =   attr;
           }
           else {
            domElt.style.webkitTransitionProperty +=   ", " +attr;
           }

           if (domElt.style.webkitTransitionTimingFunction.length === 0) {
                domElt.style.webkitTransitionTimingFunction +=  (timing || "linear");
           }
           else {
            domElt.style.webkitTransitionTimingFunction +=  ", " + (timing || "linear");
           }
            setTimeout(function () {
                domElt.style.cssText += ";" + attr + ":" + value;
            },1);
        });

        return d.promise;
            
    };

    return Z;

})();
