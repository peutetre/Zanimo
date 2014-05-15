'use strict';

var prefix = require('vendor-prefix'),
    normalizeTransformValue = require('./normalize-transform-value'),
    normalizeTimingFunction = require('./normalize-timing-function'),
    transition = prefix.dash('transition'),
    el = document.createElement('div'),
    test = 'opacity 100ms linear 0s',
    normalizedTest = normalizeTransformValue(test),
    shorthand = function shorthand(v, d, t) {
        return v + " " + d + "ms " + (t || "linear");
    };

el.style[transition] = normalizedTest;

if(normalizeTransformValue(el.style[transition]) === normalizedTest) {
    shorthand = function (v, d, t) {
        return v + " " + d + "ms " + (normalizeTimingFunction(t) || "linear") + " 0s";
    };
}

module.exports = shorthand;
