/*
 * launch.js - start Zanimo tests with Phantom.js
 */

var page = require('webpage').create(),
    url = 'test/index.html',
    color = function (m) { return m.replace(/▶ /g, "\n  \033[36m▶ \033[0m"); };

console.log(
    "Phantom.js version: " +
    [ phantom.version.major,
      phantom.version.minor,
      phantom.version.patch ].join(".")
);

page.onCallback = function(result) { return result; };

page.onConsoleMessage = function(msg) {
    if (msg.indexOf("EXIT") !== -1 ) {
        phantom.exit(parseInt(msg.replace(/EXIT/, ""), 10));
    }
    else if (msg.indexOf("✔") !== -1) {
        console.log("\033[32m✔\033[0m " + color(msg.substr(1,msg.length)));
    }
    else if (msg.indexOf("✘") !== -1) {
        console.log("\033[31m✘\033[0m FAIL: " + color(msg.substr(8,msg.length)));
    }
    else {
        console.log("\n\033[36m◼ " + msg + "\033[0m");
    }
};

page.open(url, function (status) {
    console.log("Page loaded: " + status + "\n");
    page.evaluate(function() {
        start().then(function(rst) {
            var fail = 0;
            rst.forEach(function (msg) {
                console.log(msg);
                if (msg.indexOf("✘") !== -1) fail++;
            });
            return fail;
        })
        .done(function (failure) {
            console.log("EXIT " + failure);
        });
    });
});
