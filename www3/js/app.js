/*
 * app.js
 */

(function (app) {

    function $(s, c) { return (c || document).querySelector(s); }
    function $$(s, c) { return (c || document).querySelectorAll(s); }

    var curtainState = 0,
        $documentation,
        $docActiveArea,
        $hiddenA,
        $editor,
        editor,
        openCurtain = function (elt) {
            return Zanimo.transition(
                elt,
                "transform",
                "translate3d(0, -" + (window.innerHeight - 80) + "px,0)",
                400,
                "ease-in-out"
            );
        },
        openCurtainTransform = function (elt) {
            return Zanimo.transform(
                    elt,
                    "translate3d(0, -" + (window.innerHeight - 80) + "px,0)",
                    true
            );
        },
        hideCurtain = function (elt) {
            return Zanimo.transition(
                    elt,
                    "transform",
                    "translate3d(0, -" + (window.innerHeight - 30) + "px,0)",
                    400,
                    "ease-in-out"
            );
        },
        hideCurtainTransform = function (elt) {
            return Zanimo.transform(
                    elt,
                    "translate3d(0, -" + (window.innerHeight - 30) + "px,0)",
                    true
            );
        },
        closeCurtain = Zanimo.transitionf("transform", "translate3d(0,0,0)", 400, "ease-in-out"),
        errorLog = function (err) { console.log(err, err.stack); new Error(err.message); };

    app.init = function () {
        var isTouchable = document.ontouchstart === null;

        $documentation = $("article.documentation");
        $docActiveArea = $("div.active-area", $documentation);
        $editor = $("article.editor");
        $hiddenA = $("#hidden-a");

        editor = CodeMirror.fromTextArea($("textarea", $editor), {
            lineNumbers: true,
            matchBrackets: true,
            extraKeys: { "Enter" : "newlineAndIndentContinueComment" }
        });

        $docActiveArea.addEventListener(isTouchable ? "touchstart" : "click", app.activeAreaAction);
        //window.document.addEventListener("touchmove", function (evt) { evt.preventDefault(); });
        //window.addEventListener("scroll", function (evt) { window.scrollTo(0,0); });
        window.addEventListener("resize", function (evt) { app.resizeCurtain(); });
        window.addEventListener("orientationchange", function (evt) { app.resizeCurtain(); });
    };

    app.resizeCurtain = function () {
        switch(curtainState) {
            case 0:
                return Q.resolve($documentation);
            case 1:
                return Zanimo($documentation)
                        .then(openCurtainTransform, errorLog);
            case 2:
                return Zanimo($documentation)
                        .then(hideCurtainTransform, errorLog);
            default:
                new Error("Unknow state in app.resizeCurtain");
        }
    };

    app.animateCurtainToNextState = function () {
        switch(curtainState) {
            case 0:
                curtainState ++;
                return Zanimo($documentation)
                        .then(openCurtain, errorLog);
            case 1:
                curtainState ++;
                return Zanimo($documentation)
                        .then(hideCurtain, errorLog);
            case 2:
                curtainState = 0;
                return Zanimo($documentation)
                        .then(closeCurtain, errorLog);
            default:
                new Error("Unknow state in app.animateCurtainToNextState");
        }
    };

    app.activeAreaAction = function (evt) {
        console.log(evt.target.className);
        if (evt.target.className !== "twitter" && evt.target.className !== "github" && evt.target.className !== "icon-github") {
            evt.preventDefault();
        }
        $hiddenA.focus();
        app.animateCurtainToNextState();
        //return false;
    };

    window.document.addEventListener("DOMContentLoaded", function () {
        app.init();
    });

}(window.App = {}));
