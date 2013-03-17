/*
 * editor.js
 */

(function (editor, store, runner) {

    var EMPTY_SCRIPT,
        currentScript = 0,
        _editor,
        $editor,
        $hidden,
        $select,
        $playBtn,
        $saveBtn,
        $trashBtn,
        $githubBtn;

    editor.init = function () {
        $hidden = $("#hidden-a");
        $editor = $("article.editor");
        $select = $("select", $editor);
        $playBtn = $("button.icon-play", $editor);
        $saveBtn = $("button.icon-save", $editor);
        $trashBtn = $("button.icon-trash", $editor);
        $githubBtn = $("button.icon-github-alt", $editor);

        _editor = CodeMirror.fromTextArea($("textarea", $editor), {
            lineNumbers: true,
            matchBrackets: true,
            extraKeys: { "Enter" : "newlineAndIndentContinueComment" }
        });

        EMPTY_SCRIPT = $("#empty-script-help").innerHTML;

        currentScript = store.head();
        editor.populateSelect(currentScript, store);
        editor.loadExample(currentScript, store);

        $playBtn.addEventListener(isTouchable ? "touchstart" : "click", editor.onPlay);
        $saveBtn.addEventListener(isTouchable ? "touchstart" : "click", editor.onSave);
        $trashBtn.addEventListener(isTouchable ? "touchstart" : "click", editor.onTrash);
        $githubBtn.addEventListener(isTouchable ? "touchstart" : "click", editor.onGithub);
        $select.addEventListener("change", editor.onSelect);
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
        if(!store.save($select.value, _editor.getValue()))
            alert("Can't overwrite example script!");
    };

    editor.onTrash = function (evt) {
        $hidden.focus();
        if (store.isDefaultExample($select.value)) {
            alert("Can't delete example script!");
            return;
        }
        if(confirm("Delete " + $select.value + " ?")) {
            store.trash($select.value);
            editor.populateSelect(store.head(), store);
            editor.loadExample(store.head(), store);
        }
    };

    editor.onGithub = function (evt) {
        $hidden.focus();
        if(confirm("Visit on Github?")) location = "http://github.com/peutetre/Zanimo";
    };

    editor.onSelect = function (evt) {
        $hidden.focus();

        if(evt.target.value === "New") {
            var name = window.prompt("Script name:", "my-test");
            if (name !== null && name.toString().replace(/ /g,'').length > 0) {
                if (store.save(name, EMPTY_SCRIPT)) {
                    _editor.setValue(EMPTY_SCRIPT);
                    editor.populateSelect(name, store);
                    $select.value = name;
                    currentScript = name;
                }
                else {
                    alert("Can't overwrite example script!");
                    setTimeout(function () {
                        $select.value = currentScript;
                    }, 10);
                }
            }
            else {
                alert("Script name is invalid!");
                setTimeout(function () {
                    $select.value = currentScript;
                }, 10);
            }
        } else {
            editor.loadExample(evt.target.value, store);
            currentScript = evt.target.value;
        }
    };

    editor.populateSelect = function (name) {
        var items = store.getList(),
            option = DOM("option");
        option.innerHTML = "New";
        option.value = "New";
        $select.innerHTML = "";
        $select.appendChild(option);
        items.forEach(function (item) {
            option = DOM("option");
            option.innerHTML = item;
            option.value = item;
            if (item == name) option.selected = "selected";
            $select.appendChild(option);
        });
    };

    editor.loadExample = function (name) { _editor.setValue(store.get(name)); };

}(window.Editor = {}, window.Store, window.Runner));
