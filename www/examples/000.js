(function (doc, test) {

    var square = null;

    function changeHeight () {
        return Zanimo.transitionƒ("height", "200px", 1000, "ease-in");
    }

    function firstStep(elt) {
        return Zanimo.transition(elt, "background-color", "green", 1000, "ease-in");
    }

    function secondStep(elt) {
        return Zanimo.transition(elt, "width", "200px", 1000, "ease-in");
    }

    function thirdStep() {
        return Zanimo.transitionƒ("transform", "rotate(90deg)", 1000, "ease-in");
    }

    function init () {
        square = doc.createElement("div");
        doc.body.appendChild(square);
        square.id = "square1";
        square.className = "red";
    }

    function run () {
        Q.when( firstStep(square), secondStep(square).then(changeHeight()))
         .fin(function (e) { console.log(e); console.log("toto"); return e;})
         //.then( thirdStep(), test.rejectAndlog("Failed at the second step"))
         //.then( test.done(), test.fail("Failed at the thirs step") );
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
