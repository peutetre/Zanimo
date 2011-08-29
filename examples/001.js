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
        Zanimo.when( a(circle), b(), test.rejectAndlog("Failed at a") )
              .then( test.done(), test.fail("Failed at b") );
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
        "Translates the circle to 100px in the x axis, then translate it to 100px in the y axis",
        "001.js",
        init,
        run,
        clean,
        reset
    );

}(window.document, window.Test));
