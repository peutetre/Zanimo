(function (win, doc) {

    function echo(msg) {
        return function () { console.log(msg); };
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
        Zanimo.delay(3000).then(
            echo("This is test...")       
        ).then(
            echo("... 2")
        ).then(
            echo(" chaining callbacks...")    
        ).then(
            echo(" et voila!!!")
        )
    };

    doc.addEventListener("DOMContentLoaded", function () {
        console.log("DOMContentLoaded");
        tests();
    });

})(window, window.document);
