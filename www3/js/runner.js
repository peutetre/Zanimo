/*
 * runner.js - the script runner
 */

(function (runner) {

    var $animScreen,
        elements;

    runner.init = function () {
        $animScreen = $("article.anim-screen");
    };

    runner.hideScreen = function () {
        $animScreen.style.display = "none";
    };

    runner.showScreen = function () {
        $animScreen.style.display = "block";
    };

    runner.run = function (code) {
        (new Function ("create", "start", "done", "fail", code)).call(
            {},
            runner.create,
            runner.start,
            runner.done,
            runner.fail
        );
    };

    runner.create = function (definitions) {
        var el, attr;
        elements = [];
        definitions.forEach(function (def) {
            el = DOM("div");
            el.style.width = "100px";
            el.style.height = "100px";
            el.style.position = "absolute";
            el.style.backgroundColor = "rgb(118, 189, 255)";
            el.style.zIndex = 10000;
            for(attr in def) {
                el.style[attr] = def[attr];
            }
            elements.push(el);
            document.body.appendChild(el);
        });
        return elements;
    };

    runner.start = function (el) {
        $animScreen.style.display = "block";
        return Zanimo.transition($animScreen, "opacity", 1, 100)
                     .then(function () { return el; });
    };

    runner.done = function () {
        elements.forEach(function (el) {
            window.document.body.removeChild(el);
        });
        return Zanimo.transition(
            $animScreen,
            "opacity",
            0,
            100
        ).then(runner.hideScreen, runner.hideScreen);
    };

    runner.fail = function () {
        elements.forEach(function (el) {
            window.document.body.removeChild(el);
        });
        return Zanimo.transition(
            $animScreen,
            "opacity",
            0,
            100
        ).then(runner.hideScreen, runner.hideScreen).then(function() {
            alert(err);
        });
    };

}(window.Runner = {}));
