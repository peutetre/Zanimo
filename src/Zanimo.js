// TODO: 
// on ne peut set un attribut qu'une seule fois, pas besoin de le répéter et donc
// il ne peut pas y avoir plusieurs configuration possible d'une transition sur le meme elt en meme
// temps. Si on rajoute une nouvelle configuration, il faut modifier la précédente.
// et apres le tour est joué...


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
        console.log(domElt.style[property]);
    }

    function _addTransitionProperty(domElt, prefix, attr) {
        var elts = domElt.style[prefix + "TransitionProperty"] ? domElt.style[prefix +"TransitionProperty"].split(", ") : [];
        var pos = elts.indexOf(attr);

        if (pos !== -1) {
            console.log("found !!!!! : " + attr + " ==== " + elts.indexOf(attr));
        }
        else {
            _set(domElt, prefix + "TransitionProperty", attr);
            pos = domElt.style[prefix +"TransitionProperty"].split(", ").indexOf(attr);
        }
        console.log(pos);
        console.log(attr);
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

        // config the TransitionDuration property and return his position
        pos = _addTransitionProperty(domElt, prefix.name, getAttr(attr));
        _setAttributeAt(domElt, prefix.name + "TransitionDuration", duration + "ms", pos);
        _setAttributeAt(domElt, prefix.name + "TransitionTimingFunction", timing || "linear", pos);
        
        //_set(domElt, prefix.name + "TransitionDuration", duration + "ms");
        //_set(domElt, prefix.name + "TransitionProperty", getAttr(attr) );
        //_set(domElt, prefix.name + "TransitionTimingFunction", timing || "linear");
        
        domElt.style[_getAttrName(attr)] = value;
        return d.promise;
    };

    init();

    return Z;
})(navigator.userAgent);
