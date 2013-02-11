/*
 * launch.js - start Zanimo tests with Phantom.js
 */

var page = require('webpage').create(),
    url = 'index.html';

function doneMessage(msg) {
    console.log("\033[32m✔\033[0m " + msg.substr(1,msg.length))
}

function failMessage(msg) {
    console.log("\033[31m✘\033[0m FAIL: " + msg.substr(8,msg.length));
}

function log(nbr) {
    console.log("\n\033[36m" + nbr + "\033[0m");
}

page.open(url, function (s) {
    page.evaluateAsync(function () {
        window.launchTest();
    });
});

page.onCallback = function(result) {
    result.forEach(function(r) {
        if (r.indexOf("✔") !== -1) doneMessage(r);
        else if (r.indexOf("✘") !== -1) failMessage(r);
        else log(r);
    });
    phantom.exit();
};
