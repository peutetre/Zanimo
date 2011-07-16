(function (zanimo, utils, ua) {

    utils.prefixed = ["transform"];

    utils.prefix = {
        webkit : { evt : "webkitTransitionEnd", name : "webkit" },
        opera  : { evt : "oTransitionEnd"     , name : "O" },
        firefox: { evt : "transitionend"      , name : "Moz" }
    };

    utils.browser = ua.match(/.*(Chrome|Safari).*/) 
                ? "webkit" : ( ua.match(/.*Firefox.*/) 
                ? "firefox" : (navigator.appName === "Opera" 
                ? "opera": undefined) );

    utils.prefix = utils.prefix[utils.browser];

    utils._set = function (domElt, property, newValue) {
        var prop = domElt.style[property] || "";
        domElt.style[property] = (prop.length > 0) ? (prop + ", " + newValue) : newValue;
        return domElt.style[property].split(", ").indexOf(newValue);
    };

    utils._add = function (domElt, attr) {
        var props = domElt.style[utils.prefix.name + "TransitionProperty"];
        var pos = (props ? props.split(", ") : []).indexOf(attr);
        return pos === -1 ? utils._set(domElt, "TransitionProperty", attr) : pos;
    };

    utils._setAt = function (domElt, property, value, pos) {
        var vals = (domElt.style[utils.prefix.name + property] || "").split(",");
        vals[pos] = value;
        domElt.style[utils.prefix.name + property] = vals.toString();
    };

    utils._getAttr = function (s) {
        return utils.prefixed.indexOf(s) === -1 
               ? s 
               : "-" + utils.prefix.name.toLowerCase() + "-" + s;
    };

    utils._getAttrName = function (text) {
        text = utils.prefixed.indexOf(text) === -1 ? text :  utils.prefix.name + "-" + text;
        return text.split("-")
                   .reduce( function (rst, val) { 
                        return rst + val.charAt(0).toUpperCase() + val.substr(1);
                   });
    };

})(window.Zanimo, window.Zanimo.utils = window.Zanimo.utils || {}, navigator.userAgent);
