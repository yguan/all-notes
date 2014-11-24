/*jslint nomen: true*/
/*global $,define,require,angular,window,console,_ */

define(function (require, exports, module) {
    'use strict';

    var noteRepo = require('data/note-repository'),
        genericHandlers = require('view/generic-handlers'),
        theme = require('view/theme');

    exports.name = 'NotesCtrl';

    exports.controller = function ($scope, $location, $document, $timeout, $modal, $sce) {

        function getNote() {
            noteRepo.getAll({
                success: function (notes) {
                    if (notes.length > 0) {
                        $scope.note = notes[0];
                        $scope.$apply();
                    } else {
                        addNote();
                    }
                },
                failure: genericHandlers.error
            });
        }

        function addNote() {
            if ($scope.isAddingNote) {
                return;
            }
            noteRepo.add(getDefaultNote(), {
                success: function (note) {
                    $scope.note = note;
                    $scope.$apply();
                    $scope.isAddingNote = false;
                },
                failure: function (error) {
                    genericHandlers.error(error);
                    $scope.isAddingNote = false;
                }
            });
            $scope.isAddingNote = true;
        }

        $scope.note = {};

        getNote();

        $scope.bgColor = '';

        $scope.$watch('bgColor', function (newVal, oldVal) {
            if (newVal.length > 0) {
                theme.setBgColor(newVal);
            }
        });

        function getDefaultNote() {
            return {
                title: '',
                content: '',
                dateCreated: new Date()
            };
        }
        $scope.addNote = addNote;

        $scope.editNote = function ($event) {
            $timeout(function () {
                if ($event) {
                    $scope.note.content = $event.target.textContent;
                }
                $scope.note.dateModified = new Date();
                noteRepo.update($scope.note, {succes: genericHandlers.noop, failure: genericHandlers.error});
            }, 300);
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

        $scope.updateNote = function () {
            $timeout(function () {
                $scope.editNote();
            }, 300);
        };

        new AutoSuggest($('#note-content')[0]);
    };
});
