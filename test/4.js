(function (win, doc) {

    function echo(msg) {
        return function (val) { 
            console.log("value: " + val + " message: " + msg); 
            return val; 
        };
    }

    function tests() {

        var elt = doc.getElementById("square1");
        Zanimo(elt).then(function (value) {
            return Zanimo.transition(value, "transform", "scale(2)", 1000, "linear");
        }).then(function (value) {
            return Zanimo.transition(value, "transform", "scale(1)", 1000, "linear");
        });
    }

    doc.addEventListener("DOMContentLoaded", function () {
        console.log("DOMContentLoaded");
        tests();
    }, false);

})(window, window.document);
