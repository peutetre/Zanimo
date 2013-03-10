/*
 * examples.js
 */

(function (examples) {

    function $(s, c) { return (c || document).querySelector(s); }

    examples.push({
        name : "example1",
        f: $("#example1").innerHTML
    });

    examples.push({
        name : "example2",
        f: $("#example2").innerHTML
    });

}(window.Examples = []))
