(function (doc) {

    var logsContainer = $("logs");

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

    function done() {
        return function (elt) {
            logsContainer.innerHTML += '<span class="greenText">' + "Done with : " + elt.id  + '</span><br>';
        };
    }

    function fail (tag) {
        return function (r) {
            logsContainer.innerHTML += '<span class="redText">' +   tag + ":" + r + '</span><br>'; }
    }

    function withTo300In1sec () {
        return function (elt) {
            return Zanimo.transition(elt, "height", "300px", 1000, "ease-in");
        };
    }

    function firstStep() {
        return Zanimo.transition($('square1'), "background-color", "green", 1000, "ease-in");
    }

    function secondStep() {
        return function (elt) {
            return Zanimo.transition(elt, "width", "300px", 1000, "ease-in")
                         .then( withTo300In1sec(), rejectAndlog("won't be called...") );
        };
    }

    function thirdStep() {
        return function (elt) {
            return Zanimo.transition(elt, "transform", "rotate(90deg)", 1000, "ease-in");
        };
    }

    function test() {
        Zanimo.when( firstStep(), secondStep(), rejectAndlog("will be called after that when you click the test button...") )
              .then( thirdStep(), rejectAndlog("Oups... second step failed..."))
              .then( done(), fail("failed with raison => ") );
    }


    function reset() {
        $("square1").style.cssText = " ";
        //logsContainer.innerHTML = " "; 
    }

    doc.addEventListener("DOMContentLoaded", function () {
        $("trigger-test-button").addEventListener("click", test, false);
        $("trigger-reset-button").addEventListener("click", reset, false);
    }, false);

}(window.document));
