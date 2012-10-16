(function (doc, test) {

    var circle = doc.createElement("div");

    function init () {
        doc.body.appendChild(circle);
        circle.id = "circle2";
        circle.className = "red";
    }

    function scale(n) {
        return function (value) {
            return Zanimo.transition(value, "transform", "scale(" + n + ")", 1000, "linear");
        };
    }

    function run () {
        Zanimo(circle).then(scale(2) , test.fail(" 1 step") )
                      .then(scale(1) , test.fail(" 2 step") )
                      .then(scale(2) , test.fail(" 3 step") )
                      .then(scale(1) , test.fail(" 4 step") )
                      .then( test.done(), test.fail("Failure: ") );
    }

    function clean () {
        doc.body.removeChild(circle);
    }

    function reset() {
        circle.style.cssText = " ";
    }

    test.add(
        "simple-scale",
        "Simple circle scale",
        "Scale the cicrle to 2 in 1s then rescale it to 1 and repeat this steps on time.",
        "001.js",
        init,
        run,
        clean,
        reset
    );

}(window.document, window.Test));
