var Zanimo = (function () {

    var VERSION = "0.0.0",
        kDelta = 20,

        Z = function (domElt) {
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
            pos = -1,
            done = false;

        var cb = function (evt) {
            done = true;
            d.resolve(domElt);
            domElt.removeEventListener(
                Zanimo.utils.prefix.evt,
                cb,
                false
            );
        };

        domElt.addEventListener(Zanimo.utils.prefix.evt, cb, false);

        Zanimo.delay(duration + kDelta)
              .then( function () {
                  if (!done) {
                      d.resolve(Zanimo.async.reject("Transition error."));
                  }
              });

        pos = Zanimo.utils._addTransition(domElt, attr);
        Zanimo.utils._setAttributeAt(domElt, "TransitionDuration", duration + "ms", pos);
        Zanimo.utils._setAttributeAt(domElt, "TransitionTimingFunction", timing || "linear", pos);
                
        domElt.style[Zanimo.utils._getAttrName(attr)] = value;
        return d.promise;
    };

    return Z;
})();
