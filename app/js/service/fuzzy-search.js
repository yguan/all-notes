// from http://dailyjs.com/2011/03/28/node-tutorial-18/
function extractKeywords(text) {
    if (!text) return [];

    return text.
        split(/\s+/).
        filter(function(v) { return v.length > 2; }).
        filter(function(v, i, a) { return a.lastIndexOf(v) === i; });
}