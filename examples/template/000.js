(function (doc, test) {

    var square = doc.createElement("div");

    function withTo300In1sec () {
        return function (elt) {
            return Zanimo.transition(elt, "height", "200px", 1000, "ease-in");
        };
    }

    function firstStep(elt) {
        return Zanimo.transition(elt, "background-color", "green", 1000, "ease-in");
    }

    function secondStep() {
        return function (elt) {
            return Zanimo.transition(elt, "width", "200px", 1000, "ease-in")
                         .then( withTo300In1sec(), test.rejectAndlog("won't be called...") );
        };
    }

    function thirdStep() {
        return function (elt) {
            return Zanimo.transition(elt, "transform", "rotate(90deg)", 1000, "ease-in");
        };
    }

    function init () {
        doc.body.appendChild(square);
        square.id = "square1";
        square.className = "red";
    }
    
    function run () {
        Zanimo.when( firstStep(square), secondStep(), test.rejectAndlog("will be called after that when you click the test button...") )
              .then( thirdStep(), test.rejectAndlog("Oups... second step failed..."))
              .then( test.done(), test.fail("failed with raison => ") );
    }

    function clean () {
        doc.body.removeChild(square);
    }

    function reset() {
        square.style.cssText = " ";
    }

    // add the test
    test.add(
        "default",
        "Default test",
        "This is the default test",
        "000.js",
        init,
        run,
        clean,
        reset
    );

}(window.document, window.Test));
