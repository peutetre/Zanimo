/*
 * app.js - the Zanimo animation editor
 */

(function (app, curtain, store, editor, runner) {

    app.init = function () {

        curtain.init();
        store.setup();
        editor.init();
        runner.init();

        curtain.animate()
            .then(curtain.animate)
            .then(curtain.bind);
    };

    window.onerror = function (err) {
        alert(err.toString());
    };

    window.document.addEventListener("DOMContentLoaded", app.init);

}(  window.App = window.App || {},
    window.Curtain,
    window.Store,
    window.Editor,
    window.Runner
));
