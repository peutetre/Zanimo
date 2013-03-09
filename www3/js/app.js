/*
 * app.js
 */

(function (app) {

    function $(s, c) { return (c || document).querySelector(s); }
    function $$(s, c) { return (c || document).querySelectorAll(s); }
    function empty() { return undefined; }

    var curtainState = 0,
        $documentation,
        $docActiveArea,
        $hiddenA,
        $star,
        $editor,
        editor,
        openedCurtainLenght = function () { return window.innerHeight - 80; },
        hidedCurtainLenght = function () { return window.innerHeight - 30; },
        openCurtain = function (elt) {
            return Zanimo.transition(
                elt, "transform",
                "translate3d(0, -" + openedCurtainLenght() + "px,0)",
                400, "ease-in-out"
            );
        },
        openCurtainTransform = function (elt) {
            return Zanimo.transform(
                elt, "translate3d(0, -" + openedCurtainLenght() + "px,0)", true
            );
        },
        hideCurtain = function (elt) {
            return Zanimo.transition(
                elt, "transform",
                "translate3d(0, -" + hidedCurtainLenght() + "px,0)",
                400, "ease-in-out"
            );
        },
        hideCurtainTransform = function (elt) {
            return Zanimo.transform(
                elt, "translate3d(0, -" + hidedCurtainLenght() + "px,0)", true
            );
        },
        closeCurtain = Zanimo.transitionf("transform", "translate3d(0,0,0)", 400, "ease-in-out"),
        downStar = Zanimo.transitionf("transform", "translate3d(0,18px,0) rotate(150deg)", 200, "ease-in-out"),
        upStar = Zanimo.transitionf("transform", "translate3d(0,0,0)", 200, "ease-in-out"),
        errorLog = function (err) { console.log(err, err.stack); new Error(err.message); };

    app.init = function () {
        var isTouchable = document.ontouchstart === null;

        $documentation = $("article.documentation");
        $docActiveArea = $("div.active-area", $documentation);
        $editor = $("article.editor");
        $hiddenA = $("#hidden-a");
        $star = $(".chip span", $docActiveArea);

        editor = CodeMirror.fromTextArea($("textarea", $editor), {
            lineNumbers: true,
            matchBrackets: true,
            extraKeys: { "Enter" : "newlineAndIndentContinueComment" }
        });

        app.animateCurtainToNextState().then(app.animateCurtainToNextState);

        $docActiveArea.addEventListener(isTouchable ? "touchstart" : "click", app.activeAreaAction, false);
        window.addEventListener("resize", app.resizeCurtain);
        window.addEventListener("orientationchange", app.resizeCurtain);
    };

    app.resizeCurtain = function () {
        switch(curtainState) {
            case 1:
                Zanimo($documentation).then(openCurtain).done(empty, empty);
                break;
            case 2:
                Zanimo($documentation).then(hideCurtain).done(empty, empty);
        }
    };

    app.animateCurtainToNextState = function () {
        switch(curtainState) {
            case 0:
                curtainState ++;
                return Zanimo($documentation).then(openCurtain, errorLog);
            case 1:
                curtainState ++;
                return Zanimo($documentation)
                        .then(hideCurtain)
                        .then(Zanimo.f($star))
                        .then(downStar, errorLog);
            case 2:
                curtainState = 0;
                return Zanimo($documentation)
                        .then(closeCurtain)
                        .then(Zanimo.f($star))
                        .then(upStar, errorLog);
            default:
                return Q.resolve();
        }
    };

    app.activeAreaAction = function (evt) {
        $hiddenA.focus();
        app.animateCurtainToNextState();
    };

    window.document.addEventListener("DOMContentLoaded", app.init);

}(window.App = {}));
