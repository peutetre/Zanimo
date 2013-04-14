/*
 * editor.js
 */

(function (editor, store, runner) {

    var EMPTY_SCRIPT,
        currentScript = 0,
        lastEditorTouchTS = 0,
        _editor,
        $editor,
        $hidden,
        $select,
        $playBtn,
        $saveBtn,
        $trashBtn,
        $githubBtn,
        $star,
        toWhite = Zanimo.transitionf("color", "#F0F1F3", 100),
        toGreen = Zanimo.transitionf("color", "green", 100),
        isMobile = /WebKit.*Mobile.*|Android/.test(navigator.userAgent),
        codeMirror = CodeMirror || {};

    if (isMobile) {
        var cm = { el : null };
        codeMirror = {};
        codeMirror.fromTextArea = function (el, options) {
            cm.el = el; return cm;
        };
        cm.getValue = function () { return cm.el.value; };
        cm.setValue = function (code) { cm.el.value = code; };
    }

    editor.init = function () {
        $hidden = $("#hidden-a");
        $editor = $("article.editor");
        $select = $("select", $editor);
        $playBtn = $("button.icon-play", $editor);
        $saveBtn = $("button.icon-save", $editor);
        $trashBtn = $("button.icon-trash", $editor);
        $githubBtn = $("button.icon-github-alt", $editor);
        $star = $(".chip span");

        _editor = codeMirror.fromTextArea($("textarea", $editor), {
            lineNumbers: true,
            matchBrackets: true,
            indentUnit: 4,
            extraKeys: { "Enter" : "newlineAndIndentContinueComment" }
        });

        EMPTY_SCRIPT = $("#empty-script-help").innerHTML;

        currentScript = store.head();
        editor.populateSelect(currentScript, store);
        editor.loadExample(currentScript, store);

        if(isTouchable) $editor.addEventListener("touchstart", editor.onTouchStart);
        $playBtn.addEventListener(isTouchable ? "touchstart" : "click", editor.onPlay);
        $saveBtn.addEventListener(isTouchable ? "touchstart" : "click", editor.onSave);
        $trashBtn.addEventListener(isTouchable ? "touchstart" : "click", editor.onTrash);
        $githubBtn.addEventListener(isTouchable ? "touchstart" : "click", editor.onGithub);
        $select.addEventListener("change", editor.onSelect);
        window.document.addEventListener("keydown", editor.onKeydown);
    };

    editor.onKeydown = function (evt) {
        if((evt.metaKey || evt.ctrlKey) && evt.keyCode === 83) {
            evt.preventDefault();
            editor.onSave();
        }
        if((evt.metaKey || evt.ctrlKey) && evt.keyCode === 69) {
            evt.preventDefault();
            editor.onPlay();
        }
    }

    editor.onTouchStart = function (evt) {
        var t = (new Date()).getTime();
        if((t-lastEditorTouchTS) < 400) $hidden.focus();
        lastEditorTouchTS = t;
    };

    editor.onPlay = function (evt) {
        try {
            $hidden.focus();
            runner.run(_editor.getValue());
        } catch(err) {
            alert(err);
        }
    };

    editor.onSave = function (evt) {
        $hidden.focus();
        if(!store.save($select.value, _editor.getValue())) {
            alert("Can't overwrite example script!");
        } else {
            Zanimo($star)
                .then(toGreen)
                .then(toWhite)
                .then(toGreen)
                .then(toWhite)
                .then(toGreen)
                .then(toWhite);
        }
    };

    editor.onTrash = function (evt) {
        $hidden.focus();
        if (store.isDefaultExample($select.value)) {
            alert("Can't delete example script!");
            return;
        }
        if(confirm("Delete " + $select.value + " ?")) {
            store.trash($select.value);
            var head = store.head();
            if(currentScript === $select.value) currentScript = head;
            editor.populateSelect(head, store);
            editor.loadExample(head, store);
        }
    };

    editor.onGithub = function (evt) {
        $hidden.focus();
        if(confirm("Visit on Github?")) location = "http://github.com/peutetre/Zanimo";
    };

    editor.onSelect = function (evt) {
        $hidden.focus();

        if(evt.target.value === "New") {
            var name = window.prompt("Script name:", "my-test"),
                trimedName = "";
            if (name && name.length > 0 && name.trim() !== "New") {
                trimedName = name.trim();
                if (store.save(trimedName, EMPTY_SCRIPT)) {
                    _editor.setValue(EMPTY_SCRIPT);
                    editor.populateSelect(trimedName, store);
                    $select.value = trimedName;
                    currentScript = trimedName;
                }
                else {
                    $select.value = currentScript;
                    alert("Can't overwrite example script!");
                    setTimeout(function () {
                        $select.value = currentScript;
                    },10);
                }
            }
            else if (name == null) {
                $select.value = currentScript;
            }
            else {
                $select.value = currentScript;
                alert("Script name is invalid!");
                setTimeout(function () {
                    $select.value = currentScript;
                },10);
            }
        } else {
            editor.loadExample(evt.target.value, store);
            currentScript = evt.target.value;
        }
    };

    editor.populateSelect = function (name) {
        var items = store.getList(),
            exampleScripts = items.filter(function (ex) {
                return store.isDefaultExample(ex);
            }),
            userScripts = items.filter(function (ex) {
                return !store.isDefaultExample(ex);
            }),
            createOption = function (val, container) {
                var op = DOM("option");
                op.innerHTML = val;
                op.value = val;
                container.appendChild(op);
                return op;
            },
            optgroupCommands = DOM("optgroup"),
            optgroupExamples = DOM("optgroup"),
            optgroupUser = DOM("optgroup");

        $select.innerHTML = "";
        optgroupCommands.label = "Commands";
        optgroupExamples.label = "Examples";
        optgroupUser.label = "Scripts";
        $select.appendChild(optgroupCommands);
        createOption("New", $select);
        $select.appendChild(optgroupExamples);
        exampleScripts.forEach(function (ex) {
            var op = createOption(ex, $select);
            if (ex == name) op.selected = "selected";
        });
        $select.appendChild(optgroupUser);
        userScripts.forEach(function (script) {
            var op = createOption(script, $select);
            if (script == name) op.selected = "selected";
        });
    };

    editor.loadExample = function (name) { _editor.setValue(store.get(name)); };

}(window.Editor = {}, window.Store, window.Runner));
