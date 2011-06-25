(function (zanimo) {
 
    zanimo.delay = function (ms) {
        var d = zanimo.async.defer();
        setTimeout(d.resolve, ms);
        return d.promise;
    };

})(window.Zanimo = window.Zanimo || {});
