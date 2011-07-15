(function (win, doc) {

    function echo(msg) {
        return function (val) { 
            console.log("value: " + val + " message: " + msg); 
            return val; 
        };
    }

    function tests() {
        console.log("Starting tests ???? ");
    }

    doc.addEventListener("DOMContentLoaded", function () {
        tests();
    }, false);

}(window, window.document));
