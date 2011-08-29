(function (doc, test) {

    test.$ = function (id) {
        return doc.getElementById(id);
    };

    var logsContainer = test.$("logs"),
        testButton = test.$("trigger-test-button"),
        resetButton = test.$("trigger-reset-button"),
        title = test.$("title"),
        desc = test.$("desc"),
        code = test.$("code"),
        currentTestName = null,
        suite = {};

    test.rejectAndlog = function (tag) {
        return function (raison) {
            var d = Zanimo.async.defer();
            d.resolve(Zanimo.async.reject(tag + " : " + raison));
            return d.promise;
        };
    };

    test.done = function () {
        return function (elt) {
            logsContainer.innerHTML += '<span class="greenText">' + "Done with : " + elt.id  + '</span><br>';
        };
    };

    test.fail = function (tag) {
        return function (r) {
            logsContainer.innerHTML += '<span class="redText">' +   tag + ":" + r + '</span><br>'; 
        };
    };

    test.log = function (msg) {
        logsContainer.innerHTML += '<span>' + "Log: " + msg + '</span><br>';
    };

    test.reset = function () {
        suite[test.sel.value].reset();
    };

    test.run = function () {
        suite[test.sel.value].test();
    };

    test.init = function () {
        test.sel = doc.createElement("select");
        test.$("select-container").appendChild(test.sel);

        for (var name in suite) {
            suite[name].opt = doc.createElement("option");
            suite[name].opt.value = name;
            suite[name].opt.innerText = suite[name].title;
            test.sel.appendChild(suite[name].opt);
        }

        test.sel.addEventListener("change", function (evt) {
            suite[currentTestName].reset();
            suite[currentTestName].clean();
            suite[test.sel.value].init();
            currentTestName = test.sel.value;
            code.href = suite[test.sel.value].url;
            title.innerText = suite[test.sel.value].title;
            desc.innerText = suite[test.sel.value].desc;
        }, false);

        currentTestName = test.sel.value;
        suite[currentTestName].init();
        code.href = suite[currentTestName].url;
        title.innerText = suite[currentTestName].title;
        desc.innerText = suite[currentTestName].desc;
    };

    test.add = function (name, title, desc, url, init, test, clean, reset) {
        suite[name] = {
            title : title,
            desc : desc,
            init : init,
            test : test,
            clean : clean,
            reset : reset,
            url : url
        };
    };

    doc.addEventListener("DOMContentLoaded", function () {
        test.init();
        testButton.addEventListener("click", test.run, false);
        resetButton.addEventListener("click", test.reset, false);
    }, false);

}(window.document, window.Test = window.Test || {}));
