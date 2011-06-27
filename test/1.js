(function (win, doc) {

    function echo(msg) {
        return function (val) { 
            console.log("value: " + val + " message: " + msg); 
            return val; 
        };
    }

    function tests() {
    
    }

    doc.addEventListener("DOMContentLoaded", function () {
        console.log("DOMContentLoaded");
        tests();
    });

})(window, window.document);
