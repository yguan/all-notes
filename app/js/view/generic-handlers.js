/*jslint nomen: true*/
/*global $,define,require,angular,window,console */

define(function (require, exports, module) {
    'use strict';

    function noop() {
    }

    function failure(error) {
        console.log(error);
    }

    exports.noop = noop;

    exports.error = failure;

    exports.defaultOp = {
        success: noop,
        failure: failure
    };
});
