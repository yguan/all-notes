(function ( window , undefined ) {

window.AutoSuggestControl = function (element) {
    this.provider /*:SuggestionProvider*/ = new wordSuggestions();

    this.textbox = element;

    //initialize the control
    this.init();

}


/**
 * Autosuggests one or more suggestions for what the user has typed.
 * If no suggestions are passed in, then no autosuggest occurs.
 * @scope private
 * @param aSuggestions An array of suggestion strings.
 */
function autosuggest(element, aSuggestions /*:Array*/) {

    //make sure there's at least one suggestion

    if (aSuggestions.length > 0) {
            typeAhead(element, aSuggestions[0]);
    }
}


/**
 * Handles keyup events.
 * @scope private
 * @param oEvent The event object for the keyup event.
 */
AutoSuggestControl.prototype.handleKeyUp = function (oEvent /*:Event*/) {

    var iKeyCode = oEvent.keyCode;
    var evtobj = oEvent;
    window.eventobj = evtobj;
    if ((iKeyCode != 16 && iKeyCode < 32) || (iKeyCode >= 33 && iKeyCode <= 46) || (iKeyCode >= 112 && iKeyCode <= 123) || (iKeyCode == 65 && evtobj.ctrlKey) || (iKeyCode == 90 && evtobj.ctrlKey)) {
        //ignore
        if (iKeyCode == 90 && evtobj.ctrlKey) {
            // window.getSelection().deleteFromDocument();
            // TODO: need to find a way to select the rest of the text and delete.
        }
    } else {
        //request suggestions from the suggestion provider
        this.provider.requestSuggestions(oEvent.target)
    }
};

/**
 * Initializes the textarea with event handlers for
 * auto suggest functionality.
 * @scope private
 */
AutoSuggestControl.prototype.init = function () {

    //save a reference to this object
    var oThis = this;
    //assign the onkeyup event handler
    lastDate = new Date();
    oThis.textbox.onkeyup = function (oEvent) {

        //check for the proper location of the event object
        if (!oEvent) {
            oEvent = window.event;
        }
        newDate = new Date();
        if (newDate.getTime() > lastDate.getTime() + 200) {
                oThis.handleKeyUp(oEvent);
                lastDate = newDate;
        }
        };

};

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

/**
 * Inserts a suggestion into the textbox, highlighting the
 * suggested part of the text.
 * @scope private
 * @param sSuggestion The suggestion for the textbox.
 */
function typeAhead(element, sSuggestion /*:String*/) {
    var lastSpace = element.textContent.lastIndexOf(" ");
    var lastQuote = element.textContent.lastIndexOf("'");
    var lastHypen = element.textContent.lastIndexOf("-");
    var lastDoubleQuote = element.textContent.lastIndexOf('"');
    var lastEnter = element.textContent.lastIndexOf("\n");
    var lastIndex = Math.max(lastSpace, lastEnter, lastQuote, lastHypen, lastDoubleQuote) + 1;
    var contentStripped = element.textContent.substring(0, lastIndex);
    var lastWord = element.textContent.substring(lastIndex, element.textContent.length);
    element.textContent = contentStripped + sSuggestion; //.replace(lastWord,"");
    var start = element.textContent.length - sSuggestion.replace(lastWord,"").length;
    var end = element.textContent.length;
    selectRange(element, start, end);
}



/**
 * Request suggestions for the given autosuggest control.
 * @scope protected
 * @param element The autosuggest control to provide suggestions for.
 */
wordSuggestions.prototype.requestSuggestions = function (element /*:AutoSuggestControl*/) {
    var aSuggestions = [];
    var sTextbox = element.textContent;
    var sTextboxSplit = sTextbox.split(/[\s,]+/);
    var sTextboxLast = sTextboxSplit[sTextboxSplit.length-1];
    var sTextboxValue = sTextboxLast;
    if (sTextboxValue.length > 0){
        //search for matching words
        for (var i=0; i < this.words.length; i++) {
            if (this.words[i].indexOf(sTextboxValue.toLowerCase()) == 0) {
                if (this.words[i].indexOf(sTextboxValue) == 0){
                    aSuggestions.push(this.words[i]);
                }
                else if (this.words[i].indexOf(sTextboxValue.charAt(0).toLowerCase() + sTextboxValue.slice(1)) == 0) {
                    aSuggestions.push(this.words[i].charAt(0).toUpperCase() + this.words[i].slice(1));
                }
            }
        }
    }

    //provide suggestions to the control
    autosuggest(element, aSuggestions);
};
/**
 * Provides suggestions for each word.
 * @class
 * @scope public
 */
function wordSuggestions() {
    this.words = window.autoWords;
}


})( window );