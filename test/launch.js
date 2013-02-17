/*
 * launch.js - start Zanimo tests with Phantom.js
 */

var page = require('webpage').create(),
    url = 'test/index.html',
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
    },
    exit = function (nbr) {
        phantom.exit(nbr);
    };

console.log(
    "Phantom.js version: " +
    [ phantom.version.major,
      phantom.version.minor,
      phantom.version.patch ].join(".")
);



page.onCallback = function(result) {
   var s = 0;
    /*result.forEach(function(r) {
        if (r.indexOf("✔") !== -1) {
            s++;
            Log.success(r);
        }
        else if (r.indexOf("✘") !== -1) {
            Log.fail(r);
        }
        else {
            Log.log(r);
        }
    });
    exit(result.length-1 === s ? 0 : 1);*/
    return result;
};

page.onConsoleMessage = function(msg) {
    if (msg.indexOf("EXIT") !== -1 ) phantom.exit(parseInt(msg.replace(/EXIT/, ""), 10));
    else if (msg.indexOf("✔") !== -1) {
        Log.success(msg);
    }
    else if (msg.indexOf("✘") !== -1) {
        Log.fail(msg);
    }
    else {
        Log.log(msg);
    }
};
page.open(url, function (s) {
    page.evaluate(function() {
        window.start()
              .then(function(r) {
                 var fail = 0;
                 r.forEach(function (m) {
                    console.log(m);
                    if (m.indexOf("✘") !== -1) fail++;
                 });
                 return fail;
              })
              .done(function (failure) { console.log("EXIT " + failure); } );
    });
});

