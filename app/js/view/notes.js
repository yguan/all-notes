/*jslint nomen: true*/
/*global $,define,require,angular,window,console,_ */

define(function (require, exports, module) {
    'use strict';

    var noteRepo = require('data/note-repository'),
        genericHandlers = require('view/generic-handlers'),
        theme = require('view/theme'),
        noteContentElement;

    exports.name = 'NotesCtrl';

    exports.controller = function ($scope, $location, $document, $timeout, $modal, $sce) {

        function getNote() {
            noteRepo.getAll({
                success: function (notes) {
                    var note = notes[0];
                    if (notes.length > 0) {
                        $scope.note = note;
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
                    focusOnTitle();
                },
                failure: function (error) {
                    genericHandlers.error(error);
                    $scope.isAddingNote = false;
                }
            });
            $scope.isAddingNote = true;
        }

        function isLetterKey(event) {
            var keyCode = event.keyCode;
            return keyCode >= 65 && keyCode <= 90 && !event.ctrlKey && !event.shiftKey;
        }

        function focusOnTitle() {
            $('.notes .title')[0].focus();
        }

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

        function updateNote(note) {
            $timeout(function () {
                note.dateModified = new Date();
                noteRepo.update(note, {succes: genericHandlers.noop, failure: genericHandlers.error});
            }, 300);
        }

        $scope.addNote = addNote;

        $scope.updateTitle = function () {
            updateNote($scope.note);
        };

        $scope.editNote = function ($event) {
            if (isLetterKey($event)) {
                $scope.note.content = $event.target.innerHTML;
            }
            updateNote($scope.note);
        };

        $scope.trustAsHtml = function (content) {
            return $sce.trustAsHtml(content);
        };

        $scope.setCurrentNodeToClear = function () {
            $scope.noteToClear = $scope.note;
        };

        $scope.popover = {
            clearNote: function (dismiss) {
                if ($scope.noteToClear === $scope.note) {
                    $scope.note.title = '';
                    $scope.note.content = '';
                    updateNote($scope.note);
                    dismiss();
                    focusOnTitle();
                } else {
                    $scope.noteToClear.remove = true;

                    noteRepo.remove($scope.noteToClear.id, {
                        success: function () {
                            dismiss();
                        },
                        failure: genericHandlers.error
                    });
                }
            }
        };

        $scope.displayNoteTitles = function () {
            noteRepo.getAll({
                success: function (notes) {
                    $scope.noteTitles = notes;
                    $scope.displayedNoteTitles = [].concat($scope.noteTitles);
                    $scope.$apply();
                },
                failure: genericHandlers.error
            });
        };

        $scope.openNote = function (noteId) {
            noteRepo.get(noteId, {
                success: function (note) {
                    $scope.note = note;
                    $scope.$apply();
                    focusOnTitle();
                },
                failure: genericHandlers.error
            });
        };

        $scope.formatNote = function () {
            $scope.editNote();
        };

        new AutoSuggest($('.notes .content')[0]);
        focusOnTitle();
    };
});
