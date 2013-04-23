/*
 * runner.js - the script runner
 */

(function (runner) {

    var $animScreen,
        elements,
        running = false;

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
        if (!running) {
            try {
                running = true;
                elements = [];
                var p = (new Function ("create", "start", "window", "document", code)).call(
                    {},
                    runner.create,
                    runner.start,
                    {},{}
                );
                if(Q.isPromise(p)) return p.then(runner.done, runner.fail);
                throw new Error("Runner exception, you need to return a promise!");
            } catch(err) {
                runner.done().then(function () { alert(err); });
            }
        }
    };

    runner.create = function (definitions) {
        var el, attr, items = [];
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
            items.push(el);
            document.body.appendChild(el);
        });
        return items;
    };

    runner.start = function (el) {
        $animScreen.style.display = "block";
        return Q.delay(200)
                .then(Zanimo.f($animScreen))
                .then(Zanimo.transitionf("opacity", 1, 200))
                .then(function () { return el; });
    };

    runner.clean = function () {
        elements.forEach(function (el) {
            window.document.body.removeChild(el);
        });
    };

    runner.done = function () {
        runner.clean();
        return Zanimo.transition($animScreen, "opacity", 0, 200)
                     .then(runner.hideScreen, runner.hideScreen)
                     .then(function () { return Q.delay(200).then(function () {
                        running = false;
                     })});
    };

    runner.fail = function (err) {
        runner.clean();
        return Zanimo.transition($animScreen, "opacity", 0, 200)
                     .then(runner.hideScreen, runner.hideScreen)
                     .then(function () { return Q.delay(200).then(function () {
                        running = false;
                     })});
    };

}(window.Runner = {}));
