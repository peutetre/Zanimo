/*
 * app.js
 */

(function (doc) {

    var $ = function (s, ctx) { return (ctx || doc).querySelectorAll(s); },
        upAnimation = Zanimo.transitionƒ("transform", "translate3d(0,-520px,0)", 400, 'ease-in-out'),
        upArrowAnimation = Zanimo.transitionƒ("transform", "rotate(540deg)", 400, 'ease-in-out'),
        downAnimations = [
            Zanimo.transitionƒ("transform", "translate3d(0,10px,0)", 300, 'ease-in'),
            Zanimo.transitionƒ("transform", "translate3d(0,-15px,0)", 80, 'ease-in-out'),
            Zanimo.transitionƒ("transform", "translate3d(0,0px,0)", 60, 'ease-in')
        ],
        downArrowAnimation = Zanimo.transitionƒ("transform", "rotate(0)", 440, 'ease-in-out'),
        upDownloadBtnAnimations = [
            Zanimo.transitionƒ("transform", "translate3d(0,10px,0)", 100, 'ease-in'),
            Zanimo.transitionƒ("transform", "translate3d(0,-15px,0)", 80, 'ease-in-out'),
            Zanimo.transitionƒ("transform", "translate3d(0,0px,0)", 60, 'ease-in')
        ],
        downDownloadBtnAnimations = [
            Zanimo.transitionƒ("transform", "translate3d(0,-560px,0)", 250),
            Zanimo.transitionƒ("transform", "translate3d(0,-510px,0)", 60, 'ease-in'),
            Zanimo.transitionƒ("transform", "translate3d(0,-530px,0)", 60, 'ease-in-out'),
            Zanimo.transitionƒ("transform", "translate3d(0,-520px,0)", 60, 'ease-in')
        ],
        up = false;

    window.main = function () {

        function anim() {
            if (!up) {
                return Q.all([
                    Zanimo(curtain).then(upAnimation),
                    Zanimo(sign).then(upArrowAnimation)
                ]).then(function () { return Zanimo(downloadBtn) })
                  .then(upDownloadBtnAnimations[0])
                  .then(upDownloadBtnAnimations[1])
                  .then(upDownloadBtnAnimations[2])
                  .then(function () { up = true; return up; });
            }
            else {
                return Q.all([
                    Zanimo(sign).then(downArrowAnimation),
                    Zanimo(curtain).then(downAnimations[0])
                                   .then(downAnimations[1])
                                   .then(downAnimations[2])
                ]).then(function () { return Zanimo(downloadBtn) })
                  .then(downDownloadBtnAnimations[0])
                  .then(downDownloadBtnAnimations[1])
                  .then(downDownloadBtnAnimations[2])
                  .then(downDownloadBtnAnimations[3])
                  .then(function () { up = false; return up; });
            }
        }

        function onCircleClick(evt) { anim(); }

        // FIXME
        var editor = ace.edit("editor");
        editor.setTheme("ace/theme/clouds");
        editor.getSession().setMode("ace/mode/javascript");

        var circle = $(".circle")[0],
            curtain = $(".curtain")[0],
            sign = $("span", circle)[0],
            downloadBtn = $(".download")[0];

        Zanimo(downloadBtn)
            .then(downDownloadBtnAnimations[0])
            .then(downDownloadBtnAnimations[1])
            .then(downDownloadBtnAnimations[2])
            .then(downDownloadBtnAnimations[3])
            .delay(500)
            .then(anim)
            .then(function () {
                circle.addEventListener("click", anim, false);
            });

    };


    window.$ = $;

})(window.document);

window.document.addEventListener("DOMContentLoaded", window.main, false);
