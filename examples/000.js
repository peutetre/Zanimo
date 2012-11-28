(function (doc, test) {

    var square = null;

    function changeHeight () {
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
                         .then( changeHeight(), test.rejectAndlog("Failed in the first inner step of the second step") );
        };
    }

    function thirdStep() {
        return function (elt) {
            return Zanimo.transition(elt, "transform", "rotate(90deg)", 1000, "ease-in");
        };
    }

    function init () {
        square = doc.createElement("div")
        doc.body.appendChild(square);
        square.id = "square1";
        square.className = "red";
    }

    function run () {
        Q.when( firstStep(square), secondStep(), test.rejectAndlog("Failed at the first step") )
              .then( thirdStep(), test.rejectAndlog("Failed at the second step"))
              .then( test.done(), test.fail("Failed at the thirs step") );
    }

    function clean () {
        doc.body.removeChild(square);
        console.log("clean test 000");
        square = null;
        console.log("square: " + square);
    }

    function reset() {
        square.style.cssText = " ";
    }


    var desc = "First changes the background color of the square to green in 1s, \
                then in a second step changes the width to 200px in 1s, then the height to 200px in 1s \
                and in the third step rotates the square to 90deg in 1s. <br> \
                If you trigger the test another time without reseting the element you should see an error!";

    // add the test
    test.add(
        "default",
        "Default test",
        desc,
        "000.js",
        init,
        run,
        clean,
        reset
    );

}(window.document, window.Test));
