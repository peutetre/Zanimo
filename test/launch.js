/*
 * launch.js - start Zanimo tests with Phantom.js
 */

var page = require('webpage').create(),
    url = 'index.html',
    color = function (m) { return m.replace(/▶ /g, "\n  \033[36m▶ \033[0m"); },
    Log = {
        log : function log (message) {
            console.log("\n\033[36m◼ " + message + "\033[0m");
        },
        fail : function failMessage (msg) {
            console.log("\033[31m✘\033[0m FAIL: " + color(msg.substr(8,msg.length)));
        },
        success : function doneMessage (msg) {
            console.log("\033[32m✔\033[0m " + color(msg.substr(1,msg.length)));
        }
    };

page.open(url, function (s) {
    page.evaluateAsync(function () { window.launchTest(); });
});

page.onCallback = function(result) {
    result.forEach(function(r) {
        if (r.indexOf("✔") !== -1) Log.success(r);
        else if (r.indexOf("✘") !== -1) Log.fail(r);
        else Log.log(r);
    });
    phantom.exit();
};
