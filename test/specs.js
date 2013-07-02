/**
 * specs.js - testing Zanimo
 */

(function (specs) {

    var success = 0,
        results = [],
        tests = [],
        delta0 = 0;

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
        document.getElementById("qunit-testresult").innerHTML = "";
        document.getElementById("result").innerHTML = "";
        delta0 = (new Date()).getTime();
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

    function fakeQunitResults (rslt) {
        var rsltElt = document.getElementById("qunit-testresult"),
            passed = 0,
            failed = 0,
            delta = (new Date()).getTime() - delta0;

        rslt.forEach(function (r) {
            if(r.indexOf("✔") !== -1) { passed++; console.log(r); }
            else if(r.indexOf("✘") !== -1) { failed++; console.log(r); }
        });

        rsltElt.innerHTML = "Tests completed in " + delta + " milliseconds.<br> <span class='passed'>"
            + (passed + failed) + " assertions of <span class='total'>"
            + passed + "</span> passed, <span class='failed'>"
            + failed + "</span> failed.";
        window.global_test_results = { failed: failed, passed: passed, total: (passed+failed), runtime: delta };
    }

    function init () {

        var startbtn = document.getElementById("start"),
            result = document.getElementById("result"),
            clearbtn = document.getElementById("clear"),
            browserlog = function (r) {
                if(result)  result.innerHTML = r.join("<br>");
            },
            testLock = false;

        if (startbtn) {
            startbtn.addEventListener("click", function () {
                if (testLock) return;
                testLock = true;
                start().done(function(r) {
                    browserlog(r);
                    testLock = false;
                });
            }, false);
        }
        if(clearbtn) {
            clearbtn.addEventListener("click", function () {
                if(result) result.innerHTML = "";
            }, false);
        }

        // start tests if no phantomjs
        if (!window.callPhantom) {
            testLock = true;
            start().done(function(r) {
                browserlog(r);
                fakeQunitResults(r);
                testLock = false;
            });
        }
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
