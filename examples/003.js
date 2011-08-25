(function (doc, test) {

    var square = doc.createElement("div"),
        loop;

    function init () {
        doc.body.appendChild(square);
        square.id = "square3";
        square.className = "red";
    }
    
    function genLoop() {
        // TODO il faut une autre construction avec un flag pour
        // permettre d'arrêter l'animation à la fin d'une sequence
        loop = function (elt, prop, min, max) {
            function change(prop, val) {
                return Zanimo.transition(elt, prop, val, 1000, "ease-in");
            }

            (function go(){
                Zanimo.when(change(prop, max), function ( ) { return change(prop, min); }, test.fail("Oups"))
                      .then(go, test.fail("Failing in the go loop from " + prop + "... "));
             })();
        };    
    }

    function run () {
        genLoop();
        loop(square, "width", "100px", "300px");
        loop(square, "height", "100px", "300px");
    }

    function clean () {
        doc.body.removeChild(square);
    }

    function reset() {
        setTimeout(function () {
            loop = function () {};
            square.style.cssText = " ";
        }, 1);
    }

    test.add(
        "simple-loops",
        "Simple loop",
        "A simple stupid recursive loop...",
        "003.js",
        init,
        run,
        clean,
        reset
    );

}(window.document, window.Test));
