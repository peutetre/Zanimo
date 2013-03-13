/*
 * store.js - the code store
 */

(function (app) {

    var storageKey = "zanimo-examples",
        defaultExamples = [],
        storage = window.localStorage,
        load = function () { return JSON.parse(storage.getItem(storageKey)); },
        hasKey = function () { return storage.hasOwnProperty(storageKey); };

    app.Store = {
        setup : function () {
            var scripts = $$("script[data-example-id]"), data = {},
                l = scripts.length, name = null, script = null, i = 0;

            for (i; i<l; i++) {
                script = scripts.item(i);
                name = script.getAttribute("data-example-id");
                data[name] = script.innerHTML;
                defaultExamples.push(name);
            }

            if(hasKey()) return;
            storage.setItem(storageKey, JSON.stringify(data));
        },
        isDefaultExample : function (name) {
            return defaultExamples.indexOf(name) !== -1;
        },
        get : function (name) {
            if(!hasKey()) return;
            var data = load();
            return data[name] || "";
        },
        getList : function () {
            if(!hasKey()) return [];
            var data = load(),
                keys = [], key;
            for(key in data) { keys.push(key); }
            return keys;
        },
        save : function (name, code) {
            if (app.Store.isDefaultExample(name)) return false;
            var data = load();
            data[name] = code;
            storage.setItem(storageKey, JSON.stringify(data));
            return true;
        },
        trash : function (name) {
            var data = load();
            delete data[name];
            storage.setItem(storageKey, JSON.stringify(data));
        },
        head : function () {
            return app.Store.getList()[0];
        }
    };

}(window.App = window.App || {}));
