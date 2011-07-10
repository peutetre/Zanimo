var Zanimo = (function (ua) {

    var VERSION = "0.0.0",
        kDelta = 20,
        prefixedAttributs = ["transform"],
        prefix = {
            webkit : { evt : "webkitTransitionEnd", name : "webkit" },
            opera  : { evt : "oTransitionEnd"     , name : "O" },
            firefox: { evt : "transitionend"      , name : "Moz" }
        },
        browser = ua.match(/.*(Chrome|Safari).*/) 
                    ? "webkit" : ( ua.match(/.*Firefox.*/) 
                    ? "firefox" : (navigator.appName === "Opera" 
                    ? "opera": undefined));

    function init() {
        prefix = prefix[browser];
        if (!prefix) {
            throw "Unsupported browser...";
        }
    }

    function _set(domElt, property, newValue) {
        var prop = domElt.style[property] || "";
        domElt.style[property] = (prop.length > 0) ? (prop + ", " + newValue) : newValue;
    }

    function getAttr(s) {
        return prefixedAttributs.indexOf(s) === -1 
                    ? s 
                    : "-" + prefix.name.toLowerCase() + "-" + s;
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
                prefix.evt,
                cb,
                false
            );
        };

        domElt.addEventListener(prefix.evt, cb, false);

        Zanimo.delay(duration + kDelta)
              .then(
                function () {
                    if (!done) {
                        d.resolve(Zanimo.async.reject("Transition error."));
                    }
              });

        _set(domElt, prefix.name + "TransitionDuration", duration + "ms");
        _set(domElt, prefix.name + "TransitionProperty", getAttr(attr) );
        _set(domElt, prefix.name + "TransitionTimingFunction", timing || "linear");
        domElt.style.cssText += ";" + getAttr(attr) + ":" + value;
        return d.promise;
    };

    init();

    return Z;
})(navigator.userAgent);
