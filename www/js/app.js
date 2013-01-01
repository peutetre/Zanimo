/*
 * app.js
 */

(function (doc) {

    var $ = function (s, ctx) { return (ctx || doc).querySelectorAll(s); },
        upAnimation = Zanimo.transitionƒ("transform", "translate3d(0,-520px,0)", 400, 'ease-in-out'),
        upArrowAnimation = Zanimo.transitionƒ("transform", "rotate(540deg)", 400, 'ease-in-out'),
        upArrowChangeShadow = function (elt) {
            elt.style.textShadow = "-1px -2px 1px rgba(150, 176, 216, 0.99)";
            return elt;
        },
        downArrowChangeShadow = function (elt) {
            elt.style.textShadow = "1px 2px 1px rgba(150,176,216,0.99)";
            return elt;
        },
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
        stars = [],
        starPositions = [],
        up = false;

    window.main = function () {

        function createStars() {
            function g(id) {
                var s = doc.createElement("div");
                s.id = id;
                s.className = "star";
                return s;
            }

            var currentStar;
            for (var i=0,j=10; i<j; i++) {
                currentStar = g("star-"+i);
                stars.push(currentStar);
                starPositions.push("translate3d(" + (10 + i*8) + "px," + (10 + i*4) +"px,0) rotate(" + (15*i)+ "deg)");
                doc.body.appendChild(currentStar);
            }

            setTimeout(function () {
                stars.forEach(function (star, idx) {
                    Zanimo(star)
                        .then(Zanimo.transitionƒ("transform", starPositions[idx], 100, "ease-in-out"))
                        .fail(function (err) { console.log(err.stack); });
                });
            }, 200);
        }

        function anim() {
            if (!up) {
                return Q.all([
                    Zanimo(curtain).then(upAnimation),
                    Zanimo(sign).then(upArrowChangeShadow).then(upArrowAnimation)
                ]).then(function () { return Zanimo(downloadBtn) })
                  .then(upDownloadBtnAnimations[0])
                  .then(upDownloadBtnAnimations[1])
                  .then(upDownloadBtnAnimations[2])
                  .then(function () { up = true; return up; });
            }
            else {
                return Q.all([
                    Zanimo(sign).then(downArrowChangeShadow).then(downArrowAnimation),
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

        function onRun(evt) {
            try {
                console.log("try to run");
                eval(editor.getValue());
            } catch(err) {
                console.log(err.stack);
            }
        }

        function onReset(evt) {
            stars.forEach(function (star, idx) {
                Zanimo(star)
                    .then(Zanimo.transitionƒ("transform", starPositions[idx], 100, "ease-in-out"))
                    .fail(function (err) { console.log(err.stack); });
            });
        }

        // FIXME
        var editor = ace.edit("editor");
        editor.setTheme("ace/theme/clouds");
        editor.getSession().setMode("ace/mode/javascript");

        window.edit = editor;

        var circle = $(".circle")[0],
            curtain = $(".curtain")[0],
            sign = $("span", circle)[0],
            run = $("button.run")[0],
            reset = $("button.reset")[0],
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
                run.addEventListener("click", onRun, false);
                reset.addEventListener("click", onReset, false);
                createStars();
            });

    };


    window.$ = $;

})(window.document);

window.document.addEventListener("DOMContentLoaded", window.main, false);
