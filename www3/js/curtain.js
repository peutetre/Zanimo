/*
 * curtain.js - the curtain containing the documentation
 */

(function (curtain) {

    var state = 0,
        $documentation,
        $activeArea,
        $star,
        $hiddenA,
        openedLenght = function () {
            return "translate3d(0, -" + (window.innerHeight - 80) + "px,0)";
        },
        hiddenLenght = function () {
            return "translate3d(0, -" + (window.innerHeight - 30) + "px,0)";
        },
        open = function (elt) {
            return Zanimo.transition(elt, "transform", openedLenght(), 400, "ease-in-out");
        },
        hide = function (elt) {
            return Zanimo.transition(elt, "transform", hiddenLenght(), 400, "ease-in-out");
        },
        close = Zanimo.transitionf("transform", "translate3d(0,0,0)", 400, "ease-in-out"),
        downStar = Zanimo.transitionf("transform", "translate3d(0,18px,0) rotate(150deg)", 200, "ease-in-out"),
        upStar = Zanimo.transitionf("transform", "translate3d(0,0,0)", 200, "ease-in-out"),
        errorLog = function (err) { new Error(err.message); },
        resize = function () {
            if(state == 1)
                Zanimo($documentation).then(open).done(empty, empty);
            else if (state == 2)
                Zanimo($documentation).then(hide).done(empty, empty);
        },
        animate = function () {
            switch(state) {
                case 0:
                    state ++;
                    return Zanimo($documentation).then(open, errorLog);
                case 1:
                    state ++;
                    return Zanimo($documentation)
                            .then(hide)
                            .then(Zanimo.f($star))
                            .then(downStar, errorLog);
                case 2:
                    state = 0;
                    return Zanimo($documentation)
                            .then(close)
                            .then(Zanimo.f($star))
                            .then(upStar, errorLog);
                default:
                    return Q.resolve();
            }
        },
        activeAreaAction = function (evt) {
            $hiddenA.focus();
            animate();
        };

    curtain.init = function () {
        $documentation = $("article.documentation");
        $activeArea = $("div.active-area");
        $star = $(".chip span");
        $hiddenA = $("#hidden-a");
    };

    curtain.bind = function () {
         window.addEventListener("resize", resize);
         window.addEventListener("orientationchange", resize);
         $activeArea.addEventListener(isTouchable ? "touchstart" : "click", activeAreaAction);
    };

    curtain.animate = animate;

}(window.Curtain = window.Curtain || {}));
