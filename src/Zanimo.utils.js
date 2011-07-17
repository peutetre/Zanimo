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
                ? "opera": undefined) );

    utils.prefix = utils.prefix[utils.browser];
    utils.transitionProperty = utils.prefix.name + "TransitionProperty";

    utils._set = function (domElt, property, value) {
        var prop = domElt.style[property] || "";
        domElt.style[property] = (prop.length > 0) ? (prop + ", " + value) : value;
        return domElt.style[property].split(", ").indexOf(value);
    };

    utils._addTransition = function (domElt, attr, /* tmp vars */_props, _pos) {
        attr = utils._prefixCSSAttribute(attr);
        _props = domElt.style[utils.transitionProperty];
        _pos = (_props ? _props.split(", ") : []).indexOf(attr);
        return _pos === -1 ? utils._set(domElt, "TransitionProperty", attr) : _pos;
    };

    utils._setAt = function (domElt, property, value, pos) {
        var vals = (domElt.style[utils.prefix.name + property] || "").split(",");
        vals[pos] = value;
        domElt.style[utils.prefix.name + property] = vals.toString();
    };

    utils._prefixCSSAttribute = function (s) {
        return utils.prefixed.indexOf(s) === -1 ? s : utils.prefix + s;
    };

    utils._getAttrName = function (text) {
        text = utils.prefixed.indexOf(text) === -1 ? text :  utils.prefix.name + "-" + text;
        return text.split("-")
                   .reduce( function (rst, val) { 
                        return rst + val.charAt(0).toUpperCase() + val.substr(1);
                   });
    };

})(window.Zanimo, window.Zanimo.utils = window.Zanimo.utils || {}, navigator.userAgent);
