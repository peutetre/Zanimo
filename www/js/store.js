/*
 * store.js - the code store
 */

(function (store) {

    var storageKey = "zanimo-examples",
        defaultExamples = [],
        storage = window.localStorage,
        load = function () { return JSON.parse(storage.getItem(storageKey)); },
        hasKey = function () { return storage.hasOwnProperty(storageKey); };

    store.setup = function (version) {
        var scripts = $$("script[data-example-id]"), data = {}, output = {},
            l = scripts.length, name = null, script = null, i = 0;

        for (i; i<l; i++) {
            script = scripts.item(i);
            name = script.getAttribute("data-example-id");
            data[name] = script.innerHTML;
            defaultExamples.push(name);
        }

        if(hasKey() && parseInt(storage.getItem(storageKey+"VERSION"), 10) === version) return;
        if (hasKey()) {
            output = JSON.parse(storage.getItem(storageKey));
            for(var d in data)
                output[d] = data[d];
        }
        else {
            output = data;
        }
        storage.setItem(storageKey, JSON.stringify(output));
        storage.setItem(storageKey+"VERSION", version);
    };

    store.isDefaultExample = function (name) {
        return defaultExamples.indexOf(name) !== -1;
    };

    store.get = function (name) {
        if(!hasKey()) return;
        var data = load();
        return data[name] || "";
    };

    store.getList = function () {
        if(!hasKey()) return [];
        var data = load(),
            keys = [], key;
        for(key in data) { keys.push(key); }
        return keys;
    };

    store.save = function (name, code) {
        if (store.isDefaultExample(name)) return false;
        var data = load();
        data[name] = code;
        storage.setItem(storageKey, JSON.stringify(data));
        return true;
    };

    store.trash = function (name) {
        var data = load();
        delete data[name];
        storage.setItem(storageKey, JSON.stringify(data));
    };

    store.head = function () {
        return store.getList()[0];
    };

}(window.Store = window.Store || {}));
