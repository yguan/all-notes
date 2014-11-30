/*jslint nomen: true*/
/*global $,define,require,angular,window,console,_ */

define(function (require, exports, module) {
    'use strict';

    var noteRepo = require('data/note-repository'),
        noteSummaryRepo = require('data/note-summary-repository'),
        genericHandlers = require('view/generic-handlers');

    function getSummaryNote(note) {
        return {
            id: note.id,
            title: note.title,
            dateModified: note.dateModified
        };
    }

    function createNote(content) {
        var date = new Date();
        return {
            title: content.substr(0, 70),
            content: content,
            dateCreated: date,
            dateModified: date
        };
    }

    function addNote(newNote, op) {
        op = op || genericHandlers.defaultOp;
        noteRepo.add(newNote, {
            success: function (note) {
                noteSummaryRepo.add(getSummaryNote(note));
                op.success();
            },
            failure: op.failure
        });
    }

    function addNoteWithContent(content) {
        addNote(createNote(content));
    }

    function addEmptyNote(op) {
        var date = new Date();
        addNote({
            title: '',
            content: '',
            dateCreated: date,
            dateModified: date
        }, op);
    }

    function updateNote(note) {
        note.dateModified = new Date();
        noteRepo.update(note, {success: genericHandlers.noop, failure: genericHandlers.error});
        noteSummaryRepo.update(getSummaryNote(note));
    }

    function readFiles(files, processContentFn, onStartFn, onCompleteFn) {
        var reader = new FileReader(),
            fileCount = files.length;

        if (fileCount > 0) {
            onStartFn();
        }

        function readFile(index) {
            if (index >= fileCount) {
                if (fileCount > 0) {
                    onCompleteFn(fileCount);
                }
                return;
            }

            var file = files[index];
            reader.onload = function (e) {
                processContentFn(e.target.result);
                readFile(index + 1)
            };
            reader.readAsText(file);
        }

        readFile(0);
    }

    exports.addTextFilesAsNotes = function (files, onStartFn, onCompleteFn) {
        readFiles(files, addNoteWithContent, onStartFn, onCompleteFn);
    };

    exports.getSummaryNote = getSummaryNote;
    exports.addEmptyNote = addEmptyNote;
    exports.updateNote = updateNote;
});
