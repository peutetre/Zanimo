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
        return domElt.style[property].split(", ").indexOf(newValue);
    }

    function _addTransitionProperty(domElt, prefix, attr) {
        var n = prefix + "TransitionProperty";
        var props = domElt.style[name];
        var pos = (props ? props.split(", ") : []).indexOf(attr);

        if (pos === -1) {
            pos = _set(domElt, name, attr);
        }

        return pos;
    }

    function _setAttributeAt(domElt, property, value, pos) {
        vals = (domElt.style[property] || "").split(",");
        vals[pos] = value;
        domElt.style[property] = vals.toString();
    }

    function getAttr(s) {
        return prefixedAttributs.indexOf(s) === -1 
                    ? s 
                    : "-" + prefix.name.toLowerCase() + "-" + s;
    }

    function _getAttrName(text) {
        text = prefixedAttributs.indexOf(text) === -1 ? text : prefix.name + "-" + text;
        return text.split("-")
                   .reduce( function (rst, val) { 
                        return rst + val.charAt(0).toUpperCase() + val.substr(1);
                    });
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
            pos = -1,
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

        pos = _addTransitionProperty(domElt, prefix.name, getAttr(attr));
        _setAttributeAt(domElt, prefix.name + "TransitionDuration", duration + "ms", pos);
        _setAttributeAt(domElt, prefix.name + "TransitionTimingFunction", timing || "linear", pos);
                
        domElt.style[_getAttrName(attr)] = value;
        return d.promise;
    };

    init();

    return Z;
})(navigator.userAgent);
