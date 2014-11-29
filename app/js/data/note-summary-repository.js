/*jslint nomen: true*/
/*global $,define,require,angular,window,_ */

define(function (require, exports, module) {
    'use strict';
    var idb = require('data/idb'),
        dbKey = 'noteSummary',
        noopFunction = function () {},
        noop = {
            success: noopFunction,
            failure: noopFunction
        };

    module.exports = {
        add: function (note, op) {
            idb.create(dbKey, note, op || noop);
        },
        remove: function (id, op) {
            idb.remove(dbKey, id, op || noop);
        },
        get: function (id, op) {
            idb.get(dbKey, id, op || noop);
        },
        update: function (note, op) {
            idb.update(dbKey, note, op || noop);
        },
        getAll: function (op) {
            idb.getAll(dbKey, op || noop);
        }
    };

});
