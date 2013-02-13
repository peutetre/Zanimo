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

    specs.done = function done() { return true; }
    specs.fail = function fail(err) { return err; }

    function doneMessage(msg) { results.push("✔" + msg) }

    function failMessage(name, msg) {
        results.push("✘ FAIL: " + name + " " + msg);
    }

    function start () {
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

    function init () {

        var startbtn = document.getElementById("start"),
            result = document.getElementById("result"),
            clearbtn = document.getElementById("clear"),
            browserlog = function (r) {
                result.innerHTML = r.join("<br>");
            };

        startbtn.addEventListener("click", function () {
            start().done(function(r) { browserlog(r); });
        }, false);

        clearbtn.addEventListener("click", function () {
            result.innerHTML = "";
        }, false);

        window.launchTest = function () {
            start().done(function(r) { window.callPhantom(r); });
        };
    }

    window.document.addEventListener("DOMContentLoaded", init, false);

}(window.Specs = {}));

(function (helper) {
    helper.createSquare = function createSquare(id) {
        var elt = document.createElement("div");
        elt.id = id;
        elt.style.width = "100px";
        elt.style.height = "200px";
        elt.style.backgroundColor = "red";
        document.body.appendChild(elt);
        return elt;
    };

    helper.removeSquare = function removeSquare(id) {
        document.body.removeChild(document.getElementById(id));
    };
}(window.Specs.Helper = {}));
