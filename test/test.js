/**
 * test.js - testing Zanimo on phantom.js
 */

if (!phantom.injectJs('../vendor/q-e3a927d.js')) {
    console.log("Oops Q.js not loaded");
    phantom.exit();
}

if (!phantom.injectJs('../build/zanimo-0.0.4.js')) {
    console.log("Oops Zanimo.js not loaded");
    phantom.exit();
}

var success = 0,
    tests = [];

function createSquare(id) {
    var elt = document.createElement("div");
    elt.id = id;
    document.body.appendChild(elt);
    return elt;
}

function test(name, f) {
    tests.push(function testf(acc) {
        return f(name).then(function (result) {
            if(result === true) {
                doneMessage(name);
                return acc + 1;
            }
            else {
                failMessage(name, result.message);
                return acc;
            }
        }, function (err) {
            failMessage(name, err.message);
            return acc;
        });
    });
}

function done() { return true; }
function fail(err) { return err; }

function doneMessage(msg) {
    console.log("\033[32m✔\033[0m " + msg);
}

function failMessage(name, msg) {
    console.log("\033[31m☁ \033[0m FAIL: " + name + " " + msg);
}

function start() {
    success = tests.reduce(function (acc, f) {
        return acc.then(f);
    }, Q.resolve(0));

    success.then(function (val) {
        console.log("\n\033[36mNumber of successed tests: " + val + "\033[0m");
        phantom.exit();
    }, function (err) {
        console.log(err);
        phantom.exit();
    }).done();
}
