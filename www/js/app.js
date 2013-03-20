/*
 * app.js - the Zanimo animation editor
 */

(function (app, curtain, store, editor, runner) {

    var VERSION = 14;

    app.init = function () {

        curtain.init();
        store.setup(VERSION);
        runner.init();
        editor.init();

        curtain.animate()
            .then(curtain.animate)
            .then(curtain.bind);
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
