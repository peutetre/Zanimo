/*
 * app.js
 */

/* utils */
function $(s, c) { return (c || document).querySelector(s); }
function $$(s, c) { return (c || document).querySelectorAll(s); }
function empty() { }
var isTouchable = document.ontouchstart === null;

/* the curtain */
(function (app) {

    var state = 0,
        $documentation,
        $activeArea,
        $star,
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
        errorLog = function (err) { console.log(err, err.stack); new Error(err.message); },
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

    app.Curtain = {
        init : function (doc, activeArea, star, hidden) {
            $documentation = doc;
            $activeArea = activeArea;
            $star = star;
            $hiddenA = hidden;
        },
        bind : function () {
             window.addEventListener("resize", resize);
             window.addEventListener("orientationchange", resize);
             $activeArea.addEventListener(isTouchable ? "touchstart" : "click", activeAreaAction);
        },
        animate : animate
    };

}(window.App = window.App || {}));

/* the editor */
(function (app) {

    app.Editor = { };

}(window.App = window.App || {}));

/* the animation screen */
(function (app) {

    app.AnimationScreen = { };

}(window.App = window.App || {}));

/* the script runner */
(function (app) {

    app.ScriptRunner = { };

}(window.App = window.App || {}));

/* the code store */
(function (app) {

    var VERSION = "0004",
        storageKey = "zanimo-examples" + VERSION;

    app.CodeStore = {
        setup : function () {
            if(window.localStorage.hasOwnProperty(storageKey)) return;
            var output = {};
            Examples.forEach(function (example) {
                output[example.name] = example.f.toString();
            });
            window.localStorage.setItem(storageKey,JSON.stringify(output));
        },
        get : function (name) {
            if(!window.localStorage.hasOwnProperty(storageKey)) return "";
            var data = JSON.parse(window.localStorage.getItem(storageKey));
            return data[name] || "";
        },
        getList : function () {
            if(!window.localStorage.hasOwnProperty(storageKey)) return [];
            var data = JSON.parse(window.localStorage.getItem(storageKey)),
                keys = [], key;
            for(key in data) { keys.push(key); }
            return keys;
        },
        save : function (name, code) {
            if (Examples.map(function (e) { return e.name; }).indexOf(name) !== -1) {
                alert("Can't overwrite a example script...");
                return;
            }
            var data = JSON.parse(window.localStorage.getItem(storageKey));
            data[name] = code;
            window.localStorage.setItem(storageKey, JSON.stringify(data));
        },
        trash : function (name) {
            var data = JSON.parse(window.localStorage.getItem(storageKey));
            delete data[name];
            window.localStorage.setItem(storageKey, JSON.stringify(data));
        },
        head : function () {
            return app.CodeStore.getList()[0];
        }
    };

}(window.App = window.App || {}));

/* the app */
(function (app) {

    var EMPTY_SCRIPT;

    var currentScript = 0,
        $hiddenA,
        $editor,
        editor,
        $select,
        $playBtn,
        $saveBtn,
        $trashBtn,
        $githubBtn,
        $animScreen,
        examplesKeys = [];

    app.init = function () {
        $hiddenA = $("#hidden-a");

        app.Curtain.init(
            $("article.documentation"),
            $("div.active-area"),
            $(".chip span"),
            $hiddenA
        );

        $editor = $("article.editor");
        $select = $("select", $editor);
        $playBtn = $("button.icon-play", $editor);
        $saveBtn = $("button.icon-save", $editor);
        $trashBtn = $("button.icon-trash", $editor);
        $githubBtn = $("button.icon-github-alt", $editor);
        EMPTY_SCRIPT = $("#empty-script-help").innerHTML;
        $animScreen = $("article.anim-screen");

        editor = CodeMirror.fromTextArea($("textarea", $editor), {
            lineNumbers: true,
            matchBrackets: true,
            extraKeys: { "Enter" : "newlineAndIndentContinueComment" }
        });

        $playBtn.addEventListener(isTouchable ? "touchend" : "click", app.onPlay);
        $saveBtn.addEventListener(isTouchable ? "touchend" : "click", app.onSave);
        $trashBtn.addEventListener(isTouchable ? "touchend" : "click", app.onTrash);
        $githubBtn.addEventListener(isTouchable ? "touchend" : "click", app.onGithub);
        $select.addEventListener("change", app.onSelect);

        app.CodeStore.setup();
        examplesKeys = window.Examples.map(function (e) { return e.name; });
        currentScript = app.CodeStore.head();
        app.populateSelect(currentScript);
        app.loadExample(currentScript);

        app.Curtain.animate()
           .then(app.Curtain.animate)
           .then(app.Curtain.bind);
    };

    app.loadExample = function (name) {
        editor.setValue(app.CodeStore.get(name));
    };

    app.onSelect = function (evt) {
        $hiddenA.focus();
        switch(evt.target.value) {
            case "New":
                var name = window.prompt("Script name:", "my-test");
                if (name !== null && name.toString().replace(/ /g,'').length > 1) {
                    editor.setValue(EMPTY_SCRIPT);
                    app.CodeStore.save(name, EMPTY_SCRIPT);
                    app.populateSelect(name);
                    $select.value = name;
                    currentScript = name;
                }
                else {
                    $select.value = currentScript;
                }
                break;
            default:
                app.loadExample(evt.target.value);
                currentScript = evt.target.value;
                break;
        }
    };

    app.populateSelect = function (name) {
        var items = app.CodeStore.getList(),
            option = document.createElement("option");
        option.innerHTML = "New";
        option.value = "New";
        $select.innerHTML = "";
        $select.appendChild(option);
        items.forEach(function (item) {
            option = document.createElement("option");
            option.innerHTML = item;
            option.value = item;
            if (item == name) option.selected = "selected";
            $select.appendChild(option);
        });
    };

    app.onPlay = function () {
        try {
            app.runCode(editor.getValue());
        } catch(err) {
            alert(err.stack);
        }
    };

    app.clean = function () {
        try {
            if(app.cube) window.document.body.removeChild(app.cube);
            if(app.disc) window.document.body.removeChild(app.disc);
        } catch(err) {
            console.log("oops");
        }
    };

    app.runCode = function (code) {
        this.currentf = new Function("cube", "disc", "container", "start", "done", "fail", "try{\n" +code+ "\n} catch(err){console.log('Oops');alert(err);}");
        app.cube = document.createElement("div");
        app.disc = document.createElement("div");
        app.start = function (elt) {
            $animScreen.style.display = "block";
            return Zanimo.transition(
                $animScreen,
                "opacity",
                1,
                100
            ).then(function () {
                return elt;
            }, function (err) {
                return elt;
            });
        };
        app.done = function (f, elts) {
            // FIXME in the wrong order...
            // first call the f on the elements
            // then fade the animation screen back to the editor
            return function () {
                return Zanimo.transition(
                    $animScreen,
                    "opacity",
                    0,
                    100
                ).then(function () {
                    try {
                        f(elts);
                    } catch(err) {
                        app.clean();
                        alert(err);
                    }
                    $animScreen.style.display = "none";
                },function () {
                    try {
                        f(elts);
                    } catch(err) {
                        app.clean();
                        alert(err);
                    }
                    $animScreen.style.display = "none";
                });
            };
        };
        app.fail = function (f, elts) {
            return function () {
                return Zanimo.transition(
                    $animScreen,
                    "opacity",
                    0,
                    100
                ).then(function () {
                    try {
                        f(elts);
                    } catch(err) {
                        app.clean();
                        alert(err);
                    }
                });
            };
        };

        app.cube.style.width = "100px";
        app.cube.style.height = "100px";
        app.cube.style.position = "absolute";
        app.cube.style.backgroundColor = "rgb(118, 189, 255)";
        app.cube.style.zIndex = 1000;

        app.disc.style.width = "100px";
        app.disc.style.height = "100px";
        app.disc.style.borderRadius = "100px";
        app.disc.style.position = "absolute";
        app.disc.style.zIndex = 1000;
        app.disc.style.backgroundColor = "rgb(118, 189, 255)";

        this.currentf.call({}, app.cube, app.disc, window.document.body, app.start, app.done, app.fail);
    };

    app.onSave = function () {
        app.CodeStore.save($select.value, editor.getValue());
        app.populateSelect($select.value);
    };

    app.onTrash = function () {
        if (Examples.map(function (e) { return e.name; }).indexOf($select.value) !== -1) {
            alert("Can not delete example scripts!");
            return;
        }
        if(window.confirm("Delete " + $select.value + "?"))
            app.CodeStore.trash($select.value);
            app.populateSelect(app.CodeStore.head());
            app.loadExample(app.CodeStore.head());
    };

    app.onGithub = function () {
        if(window.confirm("Visit on Github?"))
            window.location = "http://github.com/peutetre/Zanimo";
    };

    window.onerror = function (err) {
        alert(err.toString());
    };

    window.document.addEventListener("DOMContentLoaded", app.init);

}(window.App = window.App || {}));
