var editor = null;
var parser = null;
const options = {
    comments: true,
    extendedIdentifiers: false,
    locations: false,
    luaVersion: "5.1",
    ranges: false,
    scope: false
};
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

    // Install event handlers.
    document.getElementsByClassName("Option").forEach((button) => {
        button.addEventListener("click", toggleOption);
        button.addEventListener("mouseenter", doHighlight);
        button.addEventListener("mouseleave", doHighlightReset);
    });

    setOptionMenuColor();
}

/* Event Handlers */

function doLuaParseOrReset() {
    // If we don't have a lex session.
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

function doHighlight(event) {
    event.relatedTarget.style.backgroundColor = optionHoverColor;
}

function doHighlightReset(event) {
    event.relatedTarget.style.backgroundColor = (event.relatedTarget.value.localeCompare("true") === 0) ? optionEnabledColor : optionDisabledColor;
}

function doLuaLex() {
    // If we don't have a lex session.
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

function toggleOption(event) {
    switch (event.relatedTarget.id) {
        case "opt-comments":
            event.relatedTarget.value = "true";
            break;
        case "opt-x-ids":
            options.extendedIdentifiers = ! options.extendedIdentifiers;
            break;
        case "opt-locations":
            options.locations = ! options.locations;
            break;
        case "opt-v51":
        case "opt-v52":
        case "opt-v53":
            // The Lua Version option should only have 1 submenu.
            if (suboption !== undefined && suboption.length === 1) {
                switch (suboption[0]) {
                    case 1:
                        options.luaVersion = "5.1";
                        break;
                    case 2:
                        options.luaVersion = "5.2";
                        break;
                    case 3:
                        options.luaVersion = "5.3";
                        break;
                    default:
                        break;
                }
            }
            break;
        case "opt-ranges":
            options.ranges = ! options.ranges;
            break;
        case "opt-scope":
            options.scope = ! options.scope;
            break;
        default:
            break;
    }

    setOptionMenuColor();
}

/* Utilities */

function getTextAreaContents() {
    var text = editor.getValue();
    // Add a newline to guarantee everything is parsed.
    return text.concat("\n");
}

function setOptionMenuColor() {
    const getLuaOptionStruct = (version) => {
        const result = { v51: false, v52: false, v53: false };

        switch (version) {
            case "5.1":
                result.v51 = true;
                break;

            case "5.2":
                result.v52 = true;
                break;

            case "5.3":
                result.v53 = true;
                break;

            default:
                break;
        }

        return result;
    };

    const getOptionColor = (optionBool) => {
        return (optionBool) ? optionEnabledColor : optionDisabledColor;
    };

    var button;

    // Comments
    button = document.getElementById("opt-comments");
    button.style.backgroundColor = getOptionColor(options.comments);

    // Extended Identifiers
    button = document.getElementById("opt-x-ids");
    button.style.backgroundColor = getOptionColor(options.extendedIdentifiers);

    // Locations
    button = document.getElementById("opt-locations");
    button.style.backgroundColor = getOptionColor(options.locations);

    // Lua Version
    const versionStruct = getLuaOptionStruct(options.luaVersion);
    // 5.1
    button = document.getElementById("opt-v51");
    button.style.backgroundColor = getOptionColor(versionStruct.v51);
    // 5.2
    button = document.getElementById("opt-v52");
    button.style.backgroundColor = getOptionColor(versionStruct.v52);
    // 5.3
    button = document.getElementById("opt-v53");
    button.style.backgroundColor = getOptionColor(versionStruct.v53);

    // Ranges
    button = document.getElementById("opt-ranges");
    button.style.backgroundColor = getOptionColor(options.ranges);

    // Scope
    button = document.getElementById("opt-scope");
    button.style.backgroundColor = getOptionColor(options.scope);
}
