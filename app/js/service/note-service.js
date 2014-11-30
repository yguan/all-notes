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
        return {
            title: content.substr(0, 70),
            content: content,
            dateCreated: new Date()
        };
    }

    function addNote(content) {
        noteRepo.add(createNote(content), {
            success: function (note) {
                noteSummaryRepo.add(getSummaryNote(note));
            },
            failure: genericHandlers.error
        });
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
        readFiles(files, addNote, onStartFn, onCompleteFn);
    };
});
