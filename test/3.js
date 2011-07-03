(function (win, doc) {

    function echo(msg) {
        return function (val) { 
            console.log("value: " + val + " message: " + msg); 
            return val; 
        };
    }

    function tests() {
        var elt = doc.getElementById("square1");
        var elt1 = doc.getElementById("square2");

        /* sequences test 1 */
        Zanimo.when(
            Zanimo.transition(elt, "background-color", "blue", 1000, "linear")   
        ).then(
            function () { return Zanimo.transition(elt, "background-color", "red", 1000, "linear"); }  
        ).then(
            function () { return Zanimo.transition(elt, "background-color", "green", 1000, "linear"); }
        ).then(
            function () { return Zanimo.transition(elt, "background-color", "pink", 1000, "linear"); }
        );

        Zanimo.when(
            Zanimo.transition(elt, "-webkit-transform", "scale(2)", 1000, "linear")   
        ).then(
            function () { return Zanimo.transition(elt, "-webkit-transform", "scale(1)", 1000, "linear"); }  
        ).then(
            function () { return Zanimo.transition(elt, "-webkit-transform", "rotate(721deg)", 1000, "linear"); }
        ).then(
            function () { return Zanimo.transition(elt, "-webkit-transform", "rotate(-360deg)", 1000, "linear"); }
        );  

        /* Sequences test 2 */
        Zanimo.transition(elt1, "-webkit-transform", "scale(2)", 1000, "linear")
              .then( function () { return Zanimo.transition(elt1, "-webkit-transform", "scale(1)", 1000, "linear"); })
              .then( function () { return Zanimo.transition(elt1, "-webkit-transform", "scale(2)", 1000, "linear"); })
              .then( function () { return Zanimo.transition(elt1, "-webkit-transform", "scale(1)", 1000, "linear"); })
              .then( function () { return Zanimo.transition(elt1, "-webkit-transform", "scale(2)", 1000, "linear"); })
              
    }

    doc.addEventListener("DOMContentLoaded", function () {
        console.log("DOMContentLoaded");
        tests();
    });

})(window, window.document);
