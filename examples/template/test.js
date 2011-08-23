(function (doc, utils) {

    function withTo300In1sec () {
        return function (elt) {
            return Zanimo.transition(elt, "height", "300px", 1000, "ease-in");
        };
    }

    function firstStep() {
        return Zanimo.transition(utils.$('square1'), "background-color", "green", 1000, "ease-in");
    }

    function secondStep() {
        return function (elt) {
            return Zanimo.transition(elt, "width", "300px", 1000, "ease-in")
                         .then( withTo300In1sec(), utils.rejectAndlog("won't be called...") );
        };
    }

    function thirdStep() {
        return function (elt) {
            return Zanimo.transition(elt, "transform", "rotate(90deg)", 1000, "ease-in");
        };
    }

    // The test...
    window.test = function () {
        Zanimo.when( firstStep(), secondStep(), utils.rejectAndlog("will be called after that when you click the test button...") )
              .then( thirdStep(), utils.rejectAndlog("Oups... second step failed..."))
              .then( utils.done(), utils.fail("failed with raison => ") );
    }

}(window.document, window.utils));
