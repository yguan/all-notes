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
        var keyCode = event.keyCode,
            element = event.target;

        if (keyCode >= 65 && keyCode <= 90) { // a-z and A-Z
            typeAhead(element);
        }
    }

    // http://stackoverflow.com/questions/16095155/javascript-contenteditable-set-cursor-caret-to-index/16100733#16100733
    function selectRange(element, start, end) {
        var rng = document.createRange(),
            sel = getSelection(),
            n, o = 0,
            tw = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, null);
        while (n = tw.nextNode()) {
            o += n.nodeValue.length;
            if (o > start) {
                rng.setStart(n, n.nodeValue.length + start - o);
                start = Infinity;
            }
            if (o >= end) {
                rng.setEnd(n, n.nodeValue.length + end - o);
                break;
            }
        }
        sel.removeAllRanges();
        sel.addRange(rng);
    }

    function typeAhead(element) {
        var splitWords = splitWordsByCursor(),
            suggestion = getSuggestion(splitWords.wordBeforeCursor),
            wordsWithSuggestion;

        if (suggestion) {
            wordsWithSuggestion = splitWords.textBeforeCursorAndLastWordSeparator + suggestion
            element.textContent = wordsWithSuggestion + splitWords.textAfterCursor;
            var start = splitWords.textBeforeCursor.length;
            var end = wordsWithSuggestion.length;
            selectRange(element, start, end);
        }
    }

    function getLastWordSeparatorIndex(text) {
        var lastSpace = text.lastIndexOf(' '),
            lastSingleQuote = text.lastIndexOf("'"),
            lastDoubleQuote = text.lastIndexOf('"'),
            lastHyphen = text.lastIndexOf('-'),
            lastUnderscore = text.lastIndexOf('_'),
            lastEnter = text.lastIndexOf("\n");
        return Math.max(lastSpace, lastEnter, lastSingleQuote, lastDoubleQuote, lastHyphen, lastUnderscore);
    }

    // from http://stackoverflow.com/questions/9959690/javascript-get-word-before-cursor
    function getWordBeforeCursor() {
        var range = window.getSelection().getRangeAt(0),
            text,
            lastWordSeparatorIndex;
        if (range.collapsed) {
            text = range.startContainer.textContent.substring(0, range.startOffset);
            lastWordSeparatorIndex = getLastWordSeparatorIndex(text);
            return text.substring(lastWordSeparatorIndex + 1, text.length - lastWordSeparatorIndex - 1);
        }
        return '';
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
                    else if (word.indexOf(toTitleCase(text)) == 0) {
                        return toTitleCase(word);
                    }
                }
            }
        }

        return null;
    }

    function toTitleCase(text) {
        return text.charAt(0).toLowerCase() + text.slice(1);
    }

    function getAllWords() {
        return window.autoSuggestWords || [];
    }

})(window);