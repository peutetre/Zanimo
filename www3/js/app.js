/*
 * app.js - the Zanimo animation editor
 */

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
        $animScreen;

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

        app.Store.setup();
        currentScript = app.Store.head();
        app.populateSelect(currentScript);
        app.loadExample(currentScript);

        app.Curtain.animate()
           .then(app.Curtain.animate)
           .then(app.Curtain.bind);
    };

    app.loadExample = function (name) {
        editor.setValue(app.Store.get(name));
    };

    app.onSelect = function (evt) {
        $hiddenA.focus();
        switch(evt.target.value) {
            case "New":
                var name = window.prompt("Script name:", "my-test");
                if (name !== null && name.toString().replace(/ /g,'').length > 1) {
                    if (app.Store.save(name, EMPTY_SCRIPT)) {
                        editor.setValue(EMPTY_SCRIPT);
                        app.populateSelect(name);
                        $select.value = name;
                        currentScript = name;
                    }
                    else {
                        $select.value = currentScript;
                        alert("Can't overwrite an example script! Copy and paste it in a new script.");
                    }
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
        var items = app.Store.getList(),
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
        if(!app.Store.save($select.value, editor.getValue()))
            alert("Can't overwrite an example script! Copy and paste it in a new script.");
    };

    app.onTrash = function () {
        if (app.Store.isDefaultExample($select.value)) {
            alert("Can't delete an example script!");
            return;
        }
        if(confirm("Delete " + $select.value + " ?")) {
            app.Store.trash($select.value);
            app.populateSelect(app.Store.head());
            app.loadExample(app.Store.head());
        }
    };

    app.onGithub = function (evt) {
        evt.preventDefault();
        if(confirm("Visit on Github?")) location = "http://github.com/peutetre/Zanimo";
    };

    window.onerror = function (err) {
        alert(err.toString());
    };

    window.document.addEventListener("DOMContentLoaded", app.init);

}(window.App = window.App || {}));
