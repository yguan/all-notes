// http://davidbcalhoun.com/2014/what-is-amd-commonjs-and-umd/
// http://stackoverflow.com/questions/13673346/supporting-both-commonjs-and-amd
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
    document.execCommand("HiliteColor", false, "yellow");
}

function highlightSearch(text) {
    doSearch(text, highlightSelectedText);
}

function removeHighlightSpan(element) {
    element.outerHTML = element.innerHTML;
}

function removeHighlights() {
    var highlightedElements = document.querySelectorAll('span[style="background-color: yellow;"]');
    _.each(highlightedElements, removeHighlightSpan);
}
