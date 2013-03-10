/*
 * examples.js
 */

(function (examples) {

    examples.push({
        name : "example1",
        f: function () {
    var setPosition = function (c) { /* do stuff */ return c; },
        animate = Zanimo.transitionf("translate3d(0,200px,0)", 200, "ease-in-out");
    return Zanimo(cube).then(setPosition).then(animate);
}
    });

    examples.push({
        name : "example2",
        f: function () {
    var setPosition = function (c) { /* do oops */ return c; },
        animate = Zanimo.transitionf("translate3d(0,200px,0)", 200, "ease-in-out");

    return Zanimo(cube).then(setPosition);
}
    });

}(window.Examples = []))
