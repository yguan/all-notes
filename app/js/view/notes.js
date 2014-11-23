/*jslint nomen: true*/
/*global $,define,require,angular,window,console,_ */

define(function (require, exports, module) {
    'use strict';

    var noteRepo = require('data/note-repository'),
        genericHandlers = require('view/generic-handlers'),
        theme = require('view/theme');

    exports.name = 'NotesCtrl';

    exports.controller = function ($scope, $location, $document, $timeout, $modal, $sce) {

        function getNotes() {
            noteRepo.getAll({
                success: function (notes) {
                    if (notes.length > 0) {
                        $scope.notes = _.sortBy(notes, function (note) {
                            return note.gridsterOptions.row;
                        });
                        $scope.$apply();
                    }
                },
                failure: genericHandlers.error
            });
        }

        //getNotes();

        $scope.isAddingNote = false;


        $scope.bgColor = '';

        $scope.$watch('bgColor', function (newVal, oldVal) {
            if (newVal.length > 0) {
                theme.setBgColor(newVal);
            }
        });

        $scope.editNote = function (note) {
            $timeout(function () {
                note.dateModified = new Date();
                noteRepo.update(note, {succes: genericHandlers.noop, failure: genericHandlers.error});
            }, 200);
        };

        $scope.trustAsHtml = function (content) {
            return $sce.trustAsHtml(content);
        };

        $scope.setNoteToDelete = function (note, $event) {
            $($event.target).closest('.player-revert').removeClass('player-revert');
            $($event.target).parents('.gs-w').addClass('player-revert');
            $scope.noteToDelete = note;
        };

        $scope.popover = {
            note: null,
            deleteNote: function (dismiss) {
                $scope.noteToDelete.remove = true;

                noteRepo.remove($scope.noteToDelete.id, {
                    success: function () {
                        dismiss();
                    },
                    failure: genericHandlers.error
                });
            }
        };

        $scope.updateNote = function (note) {
            $timeout(function () {
//                $scope.editNote(note);
            }, 300);
        };

        new AutoSuggest($('#note-content')[0]);
    };
});
