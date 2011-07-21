(function (win, doc) {

    function $(id) {
        return doc.getElementById(id);
    }

    function rejectAndlog(tag) {
        return function (raison) {
            var d = Zanimo.async.defer();
            d.resolve(Zanimo.async.reject(tag + " : " + raison));
            return d.promise;
        }
    }

    function test() {
        Zanimo.when(
            Zanimo.transition($('square1'), "background-color", "green", 1000, "ease-in"), 
            function (elt) { 
                return Zanimo.transition(elt, "width", "300px", 1000, "ease-in")
                             .then( function(elt) { 
                                        return Zanimo.transition(elt, "height", "300px", 1000, "ease-in");
                                    },
                                    rejectAndlog("won't be called...")
                                  );
                         
            }, rejectAndlog("will be called after that when you click the test button...") ).then(
                function () { console.log("ok") },
                function (raison) { console.log("failed with raison => " + raison) }
            );
    }

    doc.addEventListener("DOMContentLoaded", function () {
        // first test
        test();
        $("trigger-test-button").addEventListener("click", function () {
            // the first transition should fail because the dom element has already 'green' 
            // for the background color style attribut.
            test();
        }, false);
    }, false);

}(window, window.document));
