(function (win, doc) {

    function $(id) {
        return doc.getElementById(id);
    }

    function test() {
        Zanimo.when(Zanimo.delay(1000, $("square1")), function (elt) { 
            return Zanimo.transition(elt, "width", "300px", 1000, "ease-in"); 
        }).then(function(elt) { return Zanimo.transition(elt, "height", "300px", 1000, "ease-in") } )
          .then(function(elt) { return Zanimo.transition(elt, "height", "100px", 1000, "ease-in") } ) 
    }

    doc.addEventListener("DOMContentLoaded", function () {
        test();
    }, false);

}(window, window.document));
