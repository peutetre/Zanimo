/*
 * app.js
 */

(function (app) {

    var VERSION = "0004",
        EMPTY_SCRIPT,
        storageKey = "zanimo-examples" + VERSION;

    function $(s, c) { return (c || document).querySelector(s); }
    function $$(s, c) { return (c || document).querySelectorAll(s); }
    function empty() { }

    var curtainState = 0,
        curtainScript = 0,
        $documentation,
        $docActiveArea,
        $hiddenA,
        $star,
        $editor,
        editor,
        $select,
        $playBtn,
        $saveBtn,
        $trashBtn,
        $githubBtn,
        $animScreen,
        examplesKeys = [],
        openedCurtainLenght = function () { return window.innerHeight - 80; },
        hidedCurtainLenght = function () { return window.innerHeight - 30; },
        openCurtain = function (elt) {
            return Zanimo.transition(
                elt, "transform",
                "translate3d(0, -" + openedCurtainLenght() + "px,0)",
                400, "ease-in-out"
            );
        },
        openCurtainTransform = function (elt) {
            return Zanimo.transform(
                elt, "translate3d(0, -" + openedCurtainLenght() + "px,0)", true
            );
        },
        hideCurtain = function (elt) {
            return Zanimo.transition(
                elt, "transform",
                "translate3d(0, -" + hidedCurtainLenght() + "px,0)",
                400, "ease-in-out"
            );
        },
        hideCurtainTransform = function (elt) {
            return Zanimo.transform(
                elt, "translate3d(0, -" + hidedCurtainLenght() + "px,0)", true
            );
        },
        closeCurtain = Zanimo.transitionf("transform", "translate3d(0,0,0)", 400, "ease-in-out"),
        downStar = Zanimo.transitionf("transform", "translate3d(0,18px,0) rotate(150deg)", 200, "ease-in-out"),
        upStar = Zanimo.transitionf("transform", "translate3d(0,0,0)", 200, "ease-in-out"),
        errorLog = function (err) { console.log(err, err.stack); new Error(err.message); };

    app.init = function () {
        var isTouchable = document.ontouchstart === null;

        $documentation = $("article.documentation");
        $docActiveArea = $("div.active-area", $documentation);
        $editor = $("article.editor");
        $hiddenA = $("#hidden-a");
        $star = $(".chip span", $docActiveArea);

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

        app.animateCurtainToNextState()
           .then(app.animateCurtainToNextState);

        window.addEventListener("resize", app.resizeCurtain);
        window.addEventListener("orientationchange", app.resizeCurtain);
        $docActiveArea.addEventListener(isTouchable ? "touchstart" : "click", app.activeAreaAction);
        $playBtn.addEventListener(isTouchable ? "touchend" : "click", app.onPlay);
        $saveBtn.addEventListener(isTouchable ? "touchend" : "click", app.onSave);
        $trashBtn.addEventListener(isTouchable ? "touchend" : "click", app.onTrash);
        $githubBtn.addEventListener(isTouchable ? "touchend" : "click", app.onGithub);
        $select.addEventListener("change", app.onSelect);

        app.setupExamples();
        examplesKeys = window.Examples.map(function (e) { return e.name; });
        curtainScript = app.getFirstExampleName();
        app.populateSelect(curtainScript);
        app.loadExample(curtainScript);
    };

    app.loadExample = function (name) {
        editor.setValue(app.getCode(name));
    };

    app.getFirstExampleName = function () {
        return app.getCodeList()[0];
    };

    app.onSelect = function (evt) {
        $hiddenA.focus();
        switch(evt.target.value) {
            case "New":
                var name = window.prompt("Script name:", "my-test");
                if (name !== null && name.toString().replace(/ /g,'').length > 1) {
                    editor.setValue(EMPTY_SCRIPT);
                    app.saveScript(name, EMPTY_SCRIPT);
                    $select.value = name;
                    curtainScript = name;
                }
                else {
                    $select.value = curtainScript;
                }
                break;
            default:
                app.loadExample(evt.target.value);
                curtainScript = evt.target.value;
                break;
        }
    };

    app.populateSelect = function (name) {
        var items = app.getCodeList(),
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

    app.getCode = function (name) {
        if(!window.localStorage.hasOwnProperty(storageKey)) return "";
        var data = JSON.parse(window.localStorage.getItem(storageKey));
        return data[name] || "";
    };

    app.getCodeList = function () {
        if(!window.localStorage.hasOwnProperty(storageKey)) return [];
        var data = JSON.parse(window.localStorage.getItem(storageKey)),
            keys = [], key;
        for(key in data) { keys.push(key); }
        return keys;
    };


    app.setupExamples = function () {
        if(window.localStorage.hasOwnProperty(storageKey)) return;
        var output = {};
        Examples.forEach(function (example) {
            output[example.name] = example.f.toString();
        });
        window.localStorage.setItem(storageKey,JSON.stringify(output));
    };

    app.saveScript = function (name, code) {
        if (Examples.map(function (e) { return e.name; }).indexOf(name) !== -1) {
            alert("Can't overwrite a example script...");
            return;
        }
        var data = JSON.parse(window.localStorage.getItem(storageKey));
        data[name] = code;
        window.localStorage.setItem(storageKey, JSON.stringify(data));
        app.populateSelect(name);
    };

    app.deleteScript = function (name) {
        var data = JSON.parse(window.localStorage.getItem(storageKey)),
            firstName = app.getFirstExampleName();
        delete data[name];
        window.localStorage.setItem(storageKey, JSON.stringify(data));
        app.populateSelect(firstName);
        app.loadExample(firstName);
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
            return function () {
                return Zanimo.transition(
                    $animScreen,
                    "opacity",
                    0,
                    100
                ).then(function () {
                    $animScreen.style.display = "none";
                    try {
                        f(elts);
                    } catch(err) {
                        app.clean();
                        alert(err);
                    }
                },function () {
                    $animScreen.style.display = "none";
                    try {
                        f(elts);
                    } catch(err) {
                        app.clean();
                        alert(err);
                    }
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
        app.cube.style.backgroundColor = "red";
        app.cube.style.zIndex = 1000;

        app.disc.style.width = "100px";
        app.disc.style.height = "100px";
        app.disc.style.borderRadius = "100px";
        app.disc.style.position = "absolute";
        app.disc.style.zIndex = 1000;
        app.disc.style.backgroundColor = "green";

        this.currentf.call({}, app.cube, app.disc, window.document.body, app.start, app.done, app.fail);
    };

    app.onSave = function () {
        app.saveScript($select.value, editor.getValue());
    };

    app.onTrash = function () {
        if (Examples.map(function (e) { return e.name; }).indexOf($select.value) !== -1) {
            alert("Can not delete example scripts!");
            return;
        }
        if(window.confirm("Delete " + $select.value + "?"))
            app.deleteScript($select.value);
    };

    app.onGithub = function () {
        if(window.confirm("Visit on Github?"))
            window.location = "http://github.com/peutetre/Zanimo";
    };

    app.resizeCurtain = function () {
        switch(curtainState) {
            case 1:
                Zanimo($documentation).then(openCurtain).done(empty, empty);
                break;
            case 2:
                Zanimo($documentation).then(hideCurtain).done(empty, empty);
        }
    };

    app.animateCurtainToNextState = function () {
        switch(curtainState) {
            case 0:
                curtainState ++;
                return Zanimo($documentation).then(openCurtain, errorLog);
            case 1:
                curtainState ++;
                return Zanimo($documentation)
                        .then(hideCurtain)
                        .then(Zanimo.f($star))
                        .then(downStar, errorLog);
            case 2:
                curtainState = 0;
                return Zanimo($documentation)
                        .then(closeCurtain)
                        .then(Zanimo.f($star))
                        .then(upStar, errorLog);
            default:
                return Q.resolve();
        }
    };

    app.activeAreaAction = function (evt) {
        $hiddenA.focus();
        app.animateCurtainToNextState();
    };

    window.onerror = function (err) {
        alert(err.toString());
    };

    window.document.addEventListener("DOMContentLoaded", app.init);

}(window.App = {}));
