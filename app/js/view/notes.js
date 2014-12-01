/*jslint nomen: true*/
/*global $,define,require,angular,window,console,_ */

define(function (require, exports, module) {
    'use strict';

    var noteRepo = require('data/note-repository'),
        noteSummaryRepo = require('data/note-summary-repository'),
        genericHandlers = require('view/generic-handlers'),
        theme = require('view/theme'),
        noteService = require('service/note-service');

    exports.name = 'NotesCtrl';

    exports.controller = function ($scope, $location, $document, $timeout, $modal, $sce) {
        var $noteContent = document.querySelector('.notes .content');

        function selectElementContents(el) {
            var range = document.createRange();
            range.selectNodeContents(el);
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        }

        function getLoadingIndicatorHtml(message) {
            return '<span>' + message + ' <\/span><span class="throbber"><\/span>';
        }

        function initEvent() {
            document.addEventListener('keydown', function (event) {
                if (event.keyCode === 17) {          // when ctrl is pressed
                    $noteContent.contentEditable = false; // disable contentEditable
                }
                if (event.keyCode === 65 && event.ctrlKey) {
                    event.preventDefault();
                    selectElementContents($noteContent);
                }
            }, false);

            document.addEventListener('keyup', function (event) {
                if (event.keyCode === 17) {          // when ctrl is released
                    $noteContent.contentEditable = true;  // reenable contentEditable
                }
            }, false);
        }

        function getNote() {
            noteRepo.getAll({
                success: function (notes) {
                    var note = notes[0];
                    if (notes.length > 0) {
                        $scope.note = note;
                        $scope.$apply();
                    } else {
                        noteService.addEmptyNote();
                    }
                },
                failure: genericHandlers.error
            });
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

        function updateNote(note) {
            $timeout(function () {
                noteService.updateNote(note);
            }, 300);
        }

        $scope.addNote = function () {
            if ($scope.isAddingNote) {
                return;
            }
            noteService.addEmptyNote({
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
        };

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

        $scope.popover = {
            clearNote: function (dismiss) {
                $scope.note.title = '';
                $scope.note.content = '';
                updateNote($scope.note);
                dismiss();
                focusOnTitle();
            }
        };

        $scope.displayNoteTitles = function () {
            noteSummaryRepo.getAll({
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

        $scope.exportNotes = function () {
            var loadingIndicator = getLoadingIndicatorHtml('Exporting notes as html files');
            bootbox.alert(loadingIndicator);
            noteService.exportNotes(function () {
                bootbox.hideAll();
            });
        };

        function getUploadFilesMessage(fileCount) {
            return 'Loading ' + fileCount + ' files';
        }

        $scope.uploadTextFilesAsNotes = function (files) {
            noteService.addTextFilesAsNotes(files, {
                onStart: function () {
                    if (files.length > 0) {
                        bootbox.alert(getLoadingIndicatorHtml(getUploadFilesMessage(files.length)));
                    }
                },
                onComplete: function () {
                    bootbox.hideAll();
                }
            });
        };

        $scope.uploadFilesAsNotes = function () {
            $('.upload-file-select').click();
        };

        new AutoSuggest($noteContent);
        focusOnTitle();
        initEvent();
    };
});
