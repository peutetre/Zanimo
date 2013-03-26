/*
 * app.js - the Zanimo animation editor
 */

(function (app, curtain, store, editor, runner) {

    var VERSION = 22;

    // fix layout when no CSS calc() support available
    function fixCSSCalc() {
        var dummy = document.createElement("div"),
            calc = null;

        ["", "-webkit-", "-moz-", "-ms-"].forEach(function (prefix) {
            var t = prefix + "calc(10px)";
            dummy.style.cssText = "width:" + t + ";";
            if(dummy.style.width === t) calc = prefix + "calc";
        });

        if (calc !== null) return;

        var $doc = $(".documentation section.content"),
            $content = $(".documentation section.content div.doc-content"),
            $editor = $(".CodeMirror"),
            fixLayout = function () {
                var h = window.innerHeight;
                $doc.style.height = (h - 30) + "px";
                $content.style.height = (h - 65) + "px";
                $editor.style.height = (h - 80) + "px";
            };
        if(!isTouchable) window.addEventListener("resize", fixLayout);
        window.addEventListener("orientationchange", fixLayout);
        fixLayout();
    }

    app.init = function () {

        curtain.init();
        store.setup(VERSION);
        runner.init();
        editor.init();

        fixCSSCalc();

        curtain.animate().then(curtain.bind);
    };

    window.onerror = function (err) { alert(err); };
    window.document.addEventListener("DOMContentLoaded", app.init);

}(
    window.App = window.App || {},
    window.Curtain,
    window.Store,
    window.Editor,
    window.Runner
));
