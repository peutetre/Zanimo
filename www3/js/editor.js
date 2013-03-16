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

        $playBtn.addEventListener(isTouchable ? "touchend" : "click", editor.onPlay);
        $saveBtn.addEventListener(isTouchable ? "touchend" : "click", editor.onSave);
        $trashBtn.addEventListener(isTouchable ? "touchend" : "click", editor.onTrash);
        $githubBtn.addEventListener(isTouchable ? "touchend" : "click", editor.onGithub);
        $select.addEventListener("change", editor.onSelect);
    };

    editor.onPlay = function () {
        try {
            runner.run(_editor.getValue());
        } catch(err) {
            alert(err.stack);
        }
    };

   editor.onSave = function () {
        if(!store.save($select.value, _editor.getValue()))
            alert("Will not overwrite an example script! Copy and paste it in a new script.");
    };

    editor.onTrash = function () {
        if (store.isDefaultExample($select.value)) {
            alert("Will not delete an example script!");
            return;
        }
        if(confirm("Delete " + $select.value + " ?")) {
            store.trash($select.value);
            editor.populateSelect(store.head(), store);
            editor.loadExample(store.head(), store);
        }
    };

    editor.onGithub = function (evt) {
        evt.preventDefault();
        if(confirm("Visit on Github?")) location = "http://github.com/peutetre/Zanimo";
    };

    editor.onSelect = function (evt) {
        $hidden.focus();

        if(evt.target.value === "New") {
            var name = window.prompt("Script name:", "my-test");
            if (name !== null && name.toString().replace(/ /g,'').length > 1) {
                if (store.save(name, EMPTY_SCRIPT)) {
                    _editor.setValue(EMPTY_SCRIPT);
                    editor.populateSelect(name, store);
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
                alert("Script name is invalid!");
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

    editor.loadExample = function (name) {
        _editor.setValue(store.get(name));
    };

}(window.Editor = {}, window.Store, window.Runner));
