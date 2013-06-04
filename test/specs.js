/**
 * specs.js - testing Zanimo
 */

(function (specs) {

    var success = 0,
        results = [],
        tests = [];

    specs.test = function test(name, f) {
        tests.push(function testf(acc) {
            return f(name).then(function (result) {
                switch(result.type) {
                    case "error":
                        failMessage(name, result.msg + " " + result.val);
                        return acc;
                    case "success":
                        doneMessage(name, result.msg + " " + result.val);
                        return acc + 1;
                    default:
                        failMessage(name, "Something went wrong...");
                        return acc;
                }
            }, function (err) {
                failMessage(name, err && err.message);
                return acc;
            });
        });
    };

    specs.done = function done(msg) {
        return function (val) { return { type : "success", val : val, msg: msg }; };
    };
    specs.fail = function fail(msg) {
        return function (val) { return { type : "error", val : val, msg: msg }; };
    };

    function doneMessage(name, msg) { results.push("✔" + name + " ▶ " + msg) }

    function failMessage(name, msg) {
        results.push("✘ FAIL: " + name + " ▶ " + msg);
    }

    window.start = function () {
        results = [];
        success = tests.reduce(function (acc, f) {
            return acc.then(f);
        }, Q.resolve(0));

        return success.then(function (val) {
            results.push(val + "/" + results.length + " tests passed!");
            return results;
        }, function (err) {
            results.push(err);
            return results;
        });
    };

    function tapeOutput(rslt) {
        console.log('TAP version 13');
        console.log('1..'+(rslt.length-1));
        console.log('# Zanimo.js test suite');
        rslt.forEach(function (r, idx) {
            if (r.indexOf("✔") === 0) {
                console.log('ok ' + (idx+1) + ' ' + r)
            }
            else if(idx !== rslt.length-1) {
                console.log('not ok ' + (idx+1) + ' ' + r)
            }
        });
    }

    function init () {

        var startbtn = document.getElementById("start"),
            result = document.getElementById("result"),
            clearbtn = document.getElementById("clear"),
            browserlog = function (r) {
                result.innerHTML = r.join("<br>");
            },
            testLock = false;

        startbtn.addEventListener("click", function () {
            if (testLock) return;
            testLock = true;
            start().done(function(r) {
                browserlog(r);
                testLock = false;
            });
        }, false);

        clearbtn.addEventListener("click", function () {
            result.innerHTML = "";
        }, false);

        // start tests
        testLock = true;
        start().done(function(r) {
            browserlog(r);
            tapeOutput(r);
            testLock = false;
        });
    }

    window.document.addEventListener("DOMContentLoaded", init, false);

}(window.Specs = {}));

(function (helper) {
    helper.createSquare = function createSquare(id) {
        var elt = document.createElement("div");
        elt.id = id;
        elt.style.width = "100px";
        elt.style.height = "100px";
        elt.style.backgroundColor = "red";
        document.body.appendChild(elt);
        return elt;
    };

    helper.removeSquare = function removeSquare(id) {
        document.body.removeChild(document.getElementById(id));
    };
}(window.Helper = {}));
