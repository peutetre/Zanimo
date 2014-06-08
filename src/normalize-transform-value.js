'use strict';

var Color = require('color'),
    matchParenthesis = /(\(.+?\))/g,
    matchColors = /(\brgba\b|\bhsl\b|\bhsla\b)(\(.+?\))/g,
    space = / +/g,
    emptyString = "",
    whitespace = " ",
    zeropixel = /^0px$/g,
    zero = "0",

    normArgs = function (match) {
        var args = match.substr(1, match.length-2).split(","),
            rst = args.map(function (arg) {
                return arg.replace(space, emptyString).replace(zeropixel, zero);
            });
        return "(" + rst.join(",") + ")";
    },

    normColors = function (match) {
        var c = Color(match);
        if (c.alpha() ) { c.alpha(Math.round(c.alpha() * 10) / 10); }
        return c.rgbString();
    },

    normalize = function (val) {
        return val.replace(space, whitespace)
            .replace(matchColors, normColors)
            .replace(matchParenthesis, normArgs);
    };

module.exports = function (val) {
    if (val === null || val === undefined) return emptyString;
    return window.isNaN(val) ? normalize(val) : val.toString();
};
