// Zanimo.js
// (c) 2011-2012 Paul Panserrieu

var Zanimo = (function () {

    var VERSION = "0.0.1",

        Z = function (domElt) {
            var d = Q.defer();
            d.resolve(domElt);
            return d.promise;
        };

    Z.kDelta = 50;

    Z.delay = function (ms, domElt) {
        var d = Q.defer();
        setTimeout(function () { d.resolve(domElt || ms); }, ms);
        return d.promise;
    };

    Z.transition = function (domElt, attr, value, duration, timing) {
        var d = Q.defer(),
            pos = -1,
            done = false;

        if (!domElt || !domElt.nodeType || !(domElt.nodeType >= 0)) {
            d.resolve(Q.fcall(function () {
                throw new Error("Zanimo transition: no given dom Element!");
            }));
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
                  if (!done)
                      d.resolve(Q.fcall(function () {
                        throw new Error("Zanimo transition: " + domElt.id + " with " + attr + ":" + value);
                      }));
              });

        pos = Zanimo.utils.addTransition(domElt, attr);
        Zanimo.utils.setAttributeAt(domElt, "TransitionDuration", duration + "ms", pos);
        Zanimo.utils.setAttributeAt(domElt, "TransitionTimingFunction", timing || "linear", pos);
        Zanimo.utils.setProperty(domElt, attr, value);
        return d.promise;
    };

    return Z;
})();
