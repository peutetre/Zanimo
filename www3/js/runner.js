/*
 * runner.js - the script runner
 */

(function (runner) {

    var $animScreen;

    runner.init = function () {
        $animScreen = $("article.anim-screen");
    };

    runner.clean = function () {
        try {
            if(runner.cube) window.document.body.removeChild(runner.cube);
            if(runner.disc) window.document.body.removeChild(runner.disc);
        } catch(err) {
            console.log("oops");
        }
    };

    runner.run = function (code) {
        var currentf = new Function("cube", "disc", "container", "start", "done", "fail", "try{\n" +code+ "\n} catch(err){console.log('Oops');alert(err);}");
        runner.cube = DOM("div");
        runner.disc = DOM("div");
        runner.start = function (elt) {
            $animScreen.style.display = "block";
            return Zanimo.transition(
                $animScreen,
                "opacity",
                1,
                100
            ).then(function () {
                return elt;
            }, function (err) {
                return elt;
            });
        };
        runner.done = function (f, elts) {
            // FIXME in the wrong order...
            // first call the f on the elements
            // then fade the animation screen back to the editor
            return function () {
                return Zanimo.transition(
                    $animScreen,
                    "opacity",
                    0,
                    100
                ).then(function () {
                    try {
                        f(elts);
                    } catch(err) {
                        runner.clean();
                        alert(err);
                    }
                    $animScreen.style.display = "none";
                },function () {
                    try {
                        f(elts);
                    } catch(err) {
                        runner.clean();
                        alert(err);
                    }
                    $animScreen.style.display = "none";
                });
            };
        };
        runner.fail = function (f, elts) {
            return function () {
                return Zanimo.transition(
                    $animScreen,
                    "opacity",
                    0,
                    100
                ).then(function () {
                    try {
                        f(elts);
                    } catch(err) {
                        runner.clean();
                        alert(err);
                    }
                });
            };
        };

        runner.cube.style.width = "100px";
        runner.cube.style.height = "100px";
        runner.cube.style.position = "absolute";
        runner.cube.style.backgroundColor = "rgb(118, 189, 255)";
        runner.cube.style.zIndex = 1000;

        runner.disc.style.width = "100px";
        runner.disc.style.height = "100px";
        runner.disc.style.borderRadius = "100px";
        runner.disc.style.position = "absolute";
        runner.disc.style.zIndex = 1000;
        runner.disc.style.backgroundColor = "rgb(118, 189, 255)";

        currentf.call(
            {},
            runner.cube,
            runner.disc,
            window.document.body,
            runner.start,
            runner.done,
            runner.fail
        );
    };

}(window.Runner = {}));
