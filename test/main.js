function init () {

    var start = document.getElementById("start"),
        result = document.getElementById("result"),
        clear = document.getElementById("clear"),
        browserlog = function (r) {
            result.innerHTML = r.join("<br>");
        };

    start.addEventListener("click", function () {
        window.start()
              .done(function(r) { browserlog(r); });
    }, false);

    clear.addEventListener("click", function () {
        result.innerHTML = "";
    }, false);

    window.launchTest = function () {
        window.start()
              .done(function(r) { window.callPhantom(r); });
    };
}

window.document.addEventListener("DOMContentLoaded", init, false);
