(function (win, doc) {

    function echo(msg) {
        return function (val) { 
            console.log("value: " + val + " message: " + msg); 
            return val; 
        };
    }

    function $(el) {
        return doc.getElementById(el);
    }

    function tests() {
        var elt = $('square1');
        
        (function loop() {
            Zanimo.when(Zanimo.transition(elt, "width", "300px", 1000, "ease-in"))
                  .then(function () { 
                            Zanimo.when(Zanimo.transition(elt, "width", "100px", 1000, "ease-in"))
                                  .then(loop, echo("Error loop width fails!!!")); 
                  });
        })();


        (function loop() {
            Zanimo.when(Zanimo.transition(elt, "height", "300px", 1000, "ease-in"))
                  .then(function () { 
                            Zanimo.when(Zanimo.transition(elt, "height", "100px", 1000, "ease-in"))
                                  .then(loop, echo("Error loop height fails!!!")); 
                  });
        })();
    }

    doc.addEventListener("DOMContentLoaded", function () {
        console.log("DOMContentLoaded");
        tests();
    }, false);

})(window, window.document);
