/**
 * test.js - testing Zanimo on phantom.js
 */

var success = 0,
    results = [],
    tests = [];

function createSquare(id) {
    var elt = document.createElement("div");
    elt.id = id;
    elt.style.width = "100px";
    elt.style.height = "200px";
    elt.style.backgroundColor = "red";
    document.body.appendChild(elt);
    return elt;
}

function removeSquare(id) {
    document.body.removeChild(document.getElementById(id));
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
    results.push("✔" + msg)
}

function failMessage(name, msg) {
    results.push("✘ FAIL: " + name + " " + msg);
}

window.start = function() {
    results = [];
    success = tests.reduce(function (acc, f) {
        return acc.then(f);
    }, Q.resolve(0));

    return success.then(function (val) {
        results.push("Number of successed tests: " + val);
        return results;
    }, function (err) {
        results.push(err);
        return results;
    });
};
