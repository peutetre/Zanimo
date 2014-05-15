'use strict';

var matchParenthesis = /(\(.+?\))/g,
    space = / +/g,
    emptyString = "",
    whitespace = " ",

    normalize = function (match) {
        var args = match.substr(1, match.length-2).split(","),
            rst = args.map(function (arg) {
                return parseFloat(arg.replace(space, emptyString));
            });
        return "(" + rst.join(",") + ")";
    };

module.exports = function (t) {
    return  typeof t === 'string' ? t.replace(space, whitespace).replace(matchParenthesis, normalize) : t;
};
