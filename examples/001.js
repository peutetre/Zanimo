(function (doc, test) {

    var circle = doc.createElement("div");

    function a(elt) {
        return Zanimo.transition(elt, "transform", "translateX(100px)", 1000, "ease-in");
    }

    function b() {
        return function (elt) {
            return Zanimo.transition(elt, "transform", "translateY(100px)", 1000, "ease-in");
        };
    }

    function init () {
        doc.body.appendChild(circle);
        circle.id = "circle1";
        circle.className = "red";
    }
    
    function run () {
        Zanimo.when( a(circle), b(), test.rejectAndlog("a failed...") )
              .then( test.done(), test.fail("failed with raison => ") );
    }

    function clean () {
        doc.body.removeChild(circle);
    }

    function reset() {
        circle.style.cssText = " ";
    }

    // add the test
    test.add(
        "defaultcircle",
        "Default circle",
        "This is the default circle test",
        "001.js",
        init,
        run,
        clean,
        reset
    );

}(window.document, window.Test));
