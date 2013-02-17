/**
 * specs.js - testing Zanimo on phantom.js
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
    }

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

    function start () {
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

        window.launchTest = function () {
            start().done(function(r) { window.callPhantom(r); });
        };
        window.start = start;
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
