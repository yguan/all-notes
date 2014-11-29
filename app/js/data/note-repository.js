/*jslint nomen: true*/
/*global $,define,require,angular,window,_ */

define(function (require, exports, module) {
    'use strict';
    var idb = require('data/idb'),
        dbKey = 'note';

    module.exports = {
        add: function (note, op) {
            idb.create(dbKey, note, op);
        },
        remove: function (id, op) {
            idb.remove(dbKey, id, op);
        },
        get: function (id, op) {
            idb.get(dbKey, id, op);
        },
        update: function (note, op) {
            idb.update(dbKey, note, op);
        },
        each: function (fn, op) {
            idb.db[dbKey]
                .query()
                .filter(function (item) {
                    fn(item);
                    return false;
                })
                .execute()
                .done(op.success)
                .fail(op.failure);
        },
        getAll: function (op) {
            idb.getAll(dbKey, op);
        }
    };

});
