(function (window) {

    // rewrite autojs to support contenteditable and allow suggestion to be in any position in text.
    // https://github.com/atmb4u/AutoJS
    window.AutoSuggest = function (element) {
        init(element);
    };

    function init(element) {
        var lastDate = new Date();
        element.onkeyup = function (event) {
            var newDate = new Date();
            if (newDate.getTime() > lastDate.getTime() + 200) {
                handleKeyUp(event);
                lastDate = newDate;
            }
        };
    }

    function handleKeyUp(event) {
        var keyCode = event.keyCode;

        if (keyCode >= 65 && keyCode <= 90 && !event.ctrlKey && !event.shiftKey) { // a-z and A-Z
            typeAhead();
        }
    }

    function typeAhead() {
        var splitWords = splitWordsByCursor(),
            suggestion = getSuggestion(splitWords.wordBeforeCursor),
            suggestionSubStr;

        if (suggestion && suggestion !== splitWords.wordBeforeCursor) {
            suggestionSubStr = suggestion.substring(splitWords.wordBeforeCursor.length, suggestion.length);
            insertText(suggestionSubStr);
        }
    }

    function insertText(text) {
        var sel = window.getSelection(),
            range = sel.getRangeAt(0).cloneRange();

        document.execCommand('inserttext', false, text);
        range.setEnd(range.endContainer, range.startOffset + text.length);

        sel.removeAllRanges();
        sel.addRange(range);
    }

    function getLastWordSeparatorIndex(text) {
        var lastSpace = text.search(/ [^\s]*$/),
            lastNoneBreakingSpace = text.lastIndexOf(String.fromCharCode(160)),
            lastSingleQuote = text.lastIndexOf("'"),
            lastDoubleQuote = text.lastIndexOf('"'),
            lastHyphen = text.lastIndexOf('-'),
            lastUnderscore = text.lastIndexOf('_'),
            lastEnter = text.lastIndexOf("\n");
        return Math.max(lastSpace, lastNoneBreakingSpace, lastEnter, lastSingleQuote, lastDoubleQuote, lastHyphen, lastUnderscore);
    }

    function splitWordsByCursor() {
        var range = window.getSelection().getRangeAt(0),
            textBeforeCursor,
            textAfterCursor,
            textContent,
            lastWordSeparatorIndex;

        if (range.collapsed) {
            textContent = range.startContainer.textContent;
            textBeforeCursor = textContent.substring(0, range.startOffset);
            textAfterCursor = textContent.substr(textBeforeCursor.length, textContent.length - textBeforeCursor.length);
            lastWordSeparatorIndex = getLastWordSeparatorIndex(textBeforeCursor);
            return {
                textBeforeCursor: textBeforeCursor,
                textAfterCursor: textAfterCursor,
                textBeforeCursorAndLastWordSeparator: textBeforeCursor.substr(0, lastWordSeparatorIndex + 1),
                wordBeforeCursor: textBeforeCursor.substr(lastWordSeparatorIndex + 1, textBeforeCursor.length - lastWordSeparatorIndex - 1)
            };
        }
        return null;
    }

    function getSuggestion(text) {
        var allWords = getAllWords(),
            word,
            textLowerCase = text.toLocaleLowerCase();

        if (text.length > 0) {
            //search for matching words
            for (var i = 0; i < allWords.length; i++) {
                word = allWords[i];
                if (word.indexOf(textLowerCase) == 0) {
                    if (word.indexOf(text) == 0) {
                        return word;
                    }

                    if (text.length > 1 && text.toUpperCase() === text) {
                        return word.toUpperCase();
                    }

                    return text + word.substr(text.length, word.length - text.length);
                }
            }
        }

        return null;
    }

    function getAllWords() {
        return window.autoSuggestWords || [];
    }

})(window);