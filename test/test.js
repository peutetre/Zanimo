(function (win, doc) {

    function echo(msg) {
        return function (val) { 
            console.log("value: " + val + " message: " + msg); 
            return val; 
        };
    }

    function tests() {
        console.log("starting tests");
        
        // test 1
        Zanimo.async.when( 
            Zanimo.delay(1000),
            echo("1 First test a delay of 1s...")
        ).then(
            function () {
                Zanimo.async.when(
                    Zanimo.delay(1000),
                    echo("1 Second test a delay of 1s...")
                );
            }    
        );

        // test 2

        Zanimo.delay(100).then(
            echo("This is test...")    
        ).then(
            echo("... 2")
        ).then(
            echo(" chaining callbacks...")
        ).then(
            echo(" et voila!!!")
        );

        var s1 = doc.getElementById('square1');
        var s2 = doc.getElementById('square2');
        var s3 = doc.getElementById('square3');
        var s4 = doc.getElementById('square4');
        var s5 = doc.getElementById('square5');
        var s6 = doc.getElementById('square6');
        var s7 = doc.getElementById('square7');
        var s8 = doc.getElementById('square8');
        var s9 = doc.getElementById('square9');
        var s10 = doc.getElementById('square10');
        var s11 = doc.getElementById('square11');
        var s12 = doc.getElementById('square12');

        Zanimo.delay(300).then(
            function () {
                Zanimo.transition(s1, "width", "400px", 1000, "ease-in").then(echo("animation done"));
                Zanimo.transition(s1, "height", "400px", 1000, "ease-in").then(echo("animation2 done"));
                Zanimo.transition(s1, "height", "800px", 1000, "ease-in").then(echo("animation2 done"));
                Zanimo.transition(s1, "background-color", "black", 1000, "ease-in").then(echo("animation3 done"));
                Zanimo.transition(s1, "-webkit-transform", "rotate(390deg)", 1000, "ease-in").then(echo("animation3 done"));
            }        
        ).then(
            function () {
                Zanimo.transition(s2, "width", "400px", 1000, "ease-in").then(echo("animation done"));
                Zanimo.transition(s3, "height", "400px", 1000, "ease-in").then(echo("animation done"));
                Zanimo.transition(s4, "-webkit-transform", "rotate(390deg)", 1000, "ease-in").then(echo("animation done"));
                Zanimo.transition(s5, "width", "400px", 1000, "ease-in").then(echo("animation done"));
                Zanimo.transition(s6, "width", "400px", 1000, "ease-in").then(echo("animation done"));
                Zanimo.transition(s7, "width", "400px", 1000, "ease-in").then(echo("animation done"));
                Zanimo.transition(s8, "width", "400px", 1000, "ease-in").then(echo("animation done"));
                Zanimo.transition(s9, "width", "400px", 1000, "ease-in").then(echo("animation done"));
                Zanimo.transition(s10, "width", "400px", 1000, "ease-in").then(echo("animation done"));
                Zanimo.transition(s11, "width", "400px", 1000, "ease-in").then(echo("animation done"));
                Zanimo.transition(s12, "width", "400px", 1000, "ease-in").then(echo("animation done"));
            } 
        )



    Zanimo.when(
        Zanimo.transition(s1, "-webkit-transform", "rotate(390deg)", 1000, "ease-in"),
        function (value) {
            Zanimo.delay(10000)
                  .then(function () {
                        Zanimo.transition(value, "-webkit-transform", "rotate(-370deg)", 1000, "ease-in").then(
                            function () {
                                Zanimo.transition(value, "-webkit-transform", "rotate(370deg)", 1000, "ease-in");
                            }
                        )
                  })
        }
    );


       
    };





    doc.addEventListener("DOMContentLoaded", function () {
        console.log("DOMContentLoaded");
        tests();
    });

})(window, window.document);
