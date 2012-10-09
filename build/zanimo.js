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
(function (zanimo, utils, ua) {

    utils.prefixed = ["transform"];

    utils.prefix = {
        webkit : { evt : "webkitTransitionEnd", name : "webkit", css: "-webkit-" },
        opera  : { evt : "oTransitionEnd"     , name : "O", css: "-o-" },
        firefox: { evt : "transitionend"      , name : "Moz", css: "-moz-" }
    };

    utils.browser = ua.match(/.*(Chrome|Safari).*/) 
                ? "webkit" : ( ua.match(/.*Firefox.*/) 
                ? "firefox" : (navigator.appName === "Opera" 
                ? "opera": "webkit") );

    utils.prefix = utils.prefix[utils.browser];
    utils.transitionProperty = utils.prefix.name + "TransitionProperty";

    utils.addTransition = function (domElt, attr, /* tmp vars */_props, _pos) {
        attr = utils._prefixCSS(attr);
        _props = domElt.style[utils.transitionProperty];
        _pos = (_props ? _props.split(", ") : []).indexOf(attr);
        return _pos === -1 ? utils._appendToProperty(domElt, "TransitionProperty", attr) : _pos;
    };

    utils.setAttributeAt = function (domElt, property, value, pos) {
        var vals = (domElt.style[utils.prefix.name + property] || "").split(",");
        vals[pos] = value;
        domElt.style[utils.prefix.name + property] = vals.toString();
    };

    utils.setProperty = function (domElt, property, value) {
        domElt.style[utils._prefixAndCapitalize(property)] = value;
    };

    utils._appendToProperty = function (domElt, property, value) {
        var prop = domElt.style[property] || "";
        domElt.style[property] = (prop.length > 0) ? (prop + ", " + value) : value;
        return domElt.style[property].split(", ").indexOf(value);
    };

    utils._prefixCSS = function (s) {
        return utils.prefixed.indexOf(s) === -1 ? s : utils.prefix.css + s;
    };

    utils._prefixAndCapitalize = function (text) {
        text = utils._prefixCSS(text);
        return text.split("-").reduce( function (rst, val) { 
            return rst + val.charAt(0).toUpperCase() + val.substr(1);
        });
    };

})(window.Zanimo, window.Zanimo.utils = window.Zanimo.utils || {}, navigator.userAgent);
