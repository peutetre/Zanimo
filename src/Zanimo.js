// Zanimo.js
// (c) 2011 Paul Panserrieu

var Zanimo = (function () {

    var VERSION = "0.0.0",

        Z = function (domElt) {
            var d = Zanimo.async.defer();
            d.resolve(domElt);
            return d.promise;
        };

    Z.kDelta = 50;

    Z.delay = function (ms, domElt) {
        var d = Zanimo.async.defer();
        setTimeout(function () { d.resolve(domElt || ms); }, ms);
        return d.promise;
    };

    Z.transition = function (domElt, attr, value, duration, timing) {
        var d = Zanimo.async.defer(),
            pos = -1,
            done = false;

        if (!domElt || !domElt.nodeType || !(domElt.nodeType >= 0)) {
            d.resolve(Zanimo.async.reject("Zanimo transition Error : no given dom Element!"));
            return d.promise;
        }

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

        Zanimo.delay(duration + Z.kDelta)
              .then( function () {
                  if (!done) {
                      d.resolve(Zanimo.async.reject( "Zanimo transition Error on "
                                                     + domElt.id
                                                     + " with "
                                                     + attr
                                                     + ":"
                                                     + value
                      ));
                  }
              });

        pos = Zanimo.utils.addTransition(domElt, attr);
        Zanimo.utils.setAttributeAt(domElt, "TransitionDuration", duration + "ms", pos);
        Zanimo.utils.setAttributeAt(domElt, "TransitionTimingFunction", timing || "linear", pos);
        Zanimo.utils.setProperty(domElt, attr, value);
        return d.promise;
    };

    return Z;
})();
