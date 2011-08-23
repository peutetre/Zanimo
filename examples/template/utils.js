(function (doc, utils) {

    utils.$ = function (id) {
        return doc.getElementById(id);
    };

    var logsContainer = utils.$("logs");

    utils.rejectAndlog = function (tag) {
        return function (raison) {
            var d = Zanimo.async.defer();
            d.resolve(Zanimo.async.reject(tag + " : " + raison));
            return d.promise;
        };
    };

    utils.done = function () {
        return function (elt) {
            logsContainer.innerHTML += '<span class="greenText">' + "Done with : " + elt.id  + '</span><br>';
        };
    };

    utils.fail = function (tag) {
        return function (r) {
            logsContainer.innerHTML += '<span class="redText">' +   tag + ":" + r + '</span><br>'; }
    };

    utils.reset = function () {
        utils.$("square1").style.cssText = " ";
    };

    doc.addEventListener("DOMContentLoaded", function () {
        utils.$("trigger-test-button").addEventListener("click", test, false);
        utils.$("trigger-reset-button").addEventListener("click", utils.reset, false);
    }, false);

}(window.document, window.utils = window.utils || {}));
