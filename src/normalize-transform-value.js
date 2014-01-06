'use strict';

var matchParenthesis = /(\(.+?\))/g,
    space = / +/g,
    emptyString = "",
    whitespace = " ",
    zeropixel = /^0px$/g,
    zero = "0",

    normalize = function (match) {
        var args = match.substr(1, match.length-2).split(","),
            rst = [];
        args.forEach(function (arg) {
            rst.push(arg.replace(space, emptyString).replace(zeropixel, zero));
        });
        return "(" + rst.join(",") + ")";
    };

module.exports = function (val) {
    if (val === null || val === undefined) return emptyString;
    return window.isNaN(val) ? val.replace(space, whitespace).replace(matchParenthesis, normalize) : val.toString();
};
