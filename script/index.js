var editor = null;
var parser = null;

function onload() {
    editor = CodeMirror.fromTextArea(document.getElementById("code"), {
        lineNumbers: true,
        matchBrackets: true,
        theme: "monokai"
    });
    editor.on("cursorActivity", onCursorActivity);
}

function getTextAreaContents() {
    var text = editor.getValue();
    // add a newline to guarantee everything is parsed
    return text.concat("\n");
}

function doLuaParseOrReset() {
    // if we don't have a lex session
    if (parser === null) {
        console.log(luaparse.parse(getTextAreaContents(), {
            locations: true,
            scope: true,
            comments: false
        }));
    }
    else {
        document.getElementById("lex").innerText = "Lex";
        document.getElementById("parse").innerText = "Parse";
        parser = null;
    }
}

function doLuaLex() {
    // if we don't have a lex session
    if (parser === null) {
        parser = luaparse.parse(getTextAreaContents(), { wait: true });

        document.getElementById("lex").innerText = "Next";
        document.getElementById("parse").innerText = "Reset";
    }

    console.log(parser.lex());
}

function onCursorActivity(instance) {
    var doc = instance.getDoc();
    var offset = doc.indexFromPos(doc.getCursor());
    document.getElementById("offset").innerText = offset;
}
