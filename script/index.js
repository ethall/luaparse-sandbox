var editor = null;
var parser = null;
const optionDisabledColor = "#272822";
const optionEnabledColor = "#97b757";
const optionHoverColor = "#f92672";
const optionBackgroundMap = new Map();

/* Initializers */

function onload() {
    editor = CodeMirror.fromTextArea(document.getElementById("code"), {
        lineNumbers: true,
        matchBrackets: true,
        theme: "monokai"
    });
    editor.on("cursorActivity", onCursorActivity);

    // Redraw Options Menu backgrounds
    setOptionMenuColor();
}

/* Event Handlers */

function doLuaParseOrReset() {
    // If we don't have a lex session.
    if (parser === null) {
        console.log(luaparse.parse(getTextAreaContents(), getOptionsAsObject()));
    }
    else {
        document.getElementById("lex").innerText = "Lex";
        document.getElementById("parse").innerText = "Parse";
        parser = null;
    }
}

function doHighlight(button) {
    button.style.backgroundColor = optionHoverColor;
}

function doHighlightReset(button) {
    button.style.backgroundColor = (Boolean(button.value)) ? optionEnabledColor : optionDisabledColor;
}

function doLuaLex() {
    // If we don't have a lex session.
    if (parser === null) {
        parser = luaparse.parse(getTextAreaContents(), getOptionsAsObject(wait=true));

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

function toggleOption(button) {
    switch (button.id) {
        case "opt-comments":
        case "opt-x-ids":
        case "opt-locations":
        case "opt-ranges":
        case "opt-scope":
            if (Boolean(button.value)) {
                button.value = "";
            }
            else {
                button.value = "true";
            }
            break;
        case "opt-v51":
            // Only acknowledge click if button value is false (blank).
            if (!Boolean(button.value)) {
                button.value = "true";
                document.getElementById("opt-v52").value = "";
                document.getElementById("opt-v53").value = "";
            }
            break;
        case "opt-v52":
            // Only acknowledge click if button value is false (blank).
            if (!Boolean(button.value)) {
                document.getElementById("opt-v51").value = "";
                button.value = "true";
                document.getElementById("opt-v53").value = "";
            }
            break;
        case "opt-v53":
            // Only acknowledge click if button value is false (blank).
            if (!Boolean(button.value)) {
                document.getElementById("opt-v51").value = "";
                document.getElementById("opt-v52").value = "";
                button.value = "true";
            }
            break;
        default:
            break;
    }

    setOptionMenuColor();
}

/* Utilities */

function getOptionsAsObject(wait=false) {
    var options = { wait };

    // Comments
    options.comments = Boolean(document.getElementById("opt-comments").value);

    // Extended Identifiers
    options.extendedIdentifiers = Boolean(document.getElementById("opt-x-ids").value);

    // Locations
    options.locations = Boolean(document.getElementById("opt-locations").value);

    // Lua Version
    if (Boolean(document.getElementById("opt-v52").value)) {
        options.luaVersion = "5.2";
    }
    else if (Boolean(document.getElementById("opt-v53").value)) {
        options.luaVersion = "5.3";
    }
    else {
        options.luaVersion = "5.1";
    }

    // Ranges
    options.ranges = Boolean(document.getElementById("opt-ranges").value);

    // Scope
    options.scope = Boolean(document.getElementById("opt-scope").value);

    return options;
}

function getTextAreaContents() {
    var text = editor.getValue();
    // Add a newline to guarantee everything is parsed.
    return text.concat("\n");
}

function setOptionMenuColor() {
    const getOptionColor = (optionBool) => {
        return (optionBool) ? optionEnabledColor : optionDisabledColor;
    };

    var button;

    // Comments
    button = document.getElementById("opt-comments");
    button.style.backgroundColor = getOptionColor(Boolean(button.value));

    // Extended Identifiers
    button = document.getElementById("opt-x-ids");
    button.style.backgroundColor = getOptionColor(Boolean(button.value));

    // Locations
    button = document.getElementById("opt-locations");
    button.style.backgroundColor = getOptionColor(Boolean(button.value));

    // Lua Version
    // 5.1
    button = document.getElementById("opt-v51");
    button.style.backgroundColor = getOptionColor(Boolean(button.value));
    // 5.2
    button = document.getElementById("opt-v52");
    button.style.backgroundColor = getOptionColor(Boolean(button.value));
    // 5.3
    button = document.getElementById("opt-v53");
    button.style.backgroundColor = getOptionColor(Boolean(button.value));

    // Ranges
    button = document.getElementById("opt-ranges");
    button.style.backgroundColor = getOptionColor(Boolean(button.value));

    // Scope
    button = document.getElementById("opt-scope");
    button.style.backgroundColor = getOptionColor(Boolean(button.value));
}
