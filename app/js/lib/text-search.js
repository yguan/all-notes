// http://davidbcalhoun.com/2014/what-is-amd-commonjs-and-umd/
// http://stackoverflow.com/questions/13673346/supporting-both-commonjs-and-amd

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['exports'], factory);
    } else if (typeof exports === 'object') {
        // CommonJS
        factory(exports);
    } else {
        // Browser globals
        factory((root.commonJsStrict = {}), root.b);
    }
}(this, function (exports) {

    function doSearch(text, processMatchStr) {

        if (window.find && window.getSelection) {
            //document.designMode = "on";
            var sel = window.getSelection();
            sel.collapse(document.body, 0);

            while (window.find(text)) {
                processMatchStr();
                sel.collapseToEnd();
            }
            //document.designMode = "off";
        }
    }

    function highlightSelectedText() {
        document.execCommand('HiliteColor', false, 'yellow');
    }

    function removeHighlightSpan(element) {
        element.outerHTML = element.innerHTML;
    }

    function replaceText(newText) {
        document.execCommand('insertHTML', false, newText);
    }
    
    exports.highlight = function (text) {
        doSearch(text, highlightSelectedText);
    };

    exports.removeHighlight = function () {
        var highlightedElements = document.querySelectorAll('span[style="background-color: yellow;"]');
        _.each(highlightedElements, removeHighlightSpan);
    };

    exports.replace = function (text, newText) {
        doSearch(text, function () {
            replaceText(newText);
        });
    };

    exports.getSelectedText = function () {
        return window.getSelection().toString();
    }
}));