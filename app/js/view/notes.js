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
        var $noteContent = $('.notes .content'),
            $findText = $('.find-text');

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
                if (event.ctrlKey && event.shiftKey) {    // when ctrl and shift are pressed
                    $noteContent.contentEditable = false; // disable contentEditable
                }
                if (event.keyCode === 65 && event.ctrlKey) { // ctrl + a
                    event.preventDefault();
                    selectElementContents(event.target);
                }
                if (event.keyCode === 70 && event.ctrlKey) { // ctrl + f
                    event.preventDefault();
                    $findText.focus();
                }
            }, false);

            document.addEventListener('keyup', function (event) {
                if (event.ctrlKey || event.shiftKey) {    // when ctrl or shift is released
                    $noteContent.contentEditable = true;  // reenable contentEditable
                }
            }, false);
        }

        function setCurrentNote(note) {
            $scope.note = note;
            $scope.$apply();
        }

        function getNote() {
            noteRepo.getAll({
                success: function (notes) {
                    var lastModifiedNote;
                    if (notes.length > 0) {
                        lastModifiedNote = _.max(notes, function (note) {
                            return note.dateModified;
                        });
                        setCurrentNote(lastModifiedNote);
                    } else {
                        noteService.addEmptyNote({
                            success: setCurrentNote,
                            failure: genericHandlers.error
                        });
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

        function addDateModifiedStr(note) {
            note.dateModifiedStr = note.dateModified.toString('MMM d, y h:mm:ss a');
        }

        $scope.displayNoteTitles = function () {
            noteSummaryRepo.getAll({
                success: function (notes) {
                    $scope.noteTitles = notes;
                    $scope.displayedNoteTitles = [].concat($scope.noteTitles).forEach(addDateModifiedStr);
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
            updateNote($scope.note);
        };

        $scope.exportNotes = function (dismiss) {
            var loadingIndicator = getLoadingIndicatorHtml('Exporting notes as html files');
            bootbox.alert(loadingIndicator);
            noteService.exportNotes(function () {
                bootbox.hideAll();
            });
            dismiss();
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

        $scope.restoreEditable = function () {
            $noteContent.contentEditable = true;
        };

        $scope.handleSearch = function () {
            $('.editor-toolbar .fa-search').popover('show');
        };

        $scope.runSearch = function () {
            $noteContent.removeHighlight().highlight($scope.searchText);
            $scope.searchTextMatchCount = '( ' + $noteContent.find('.j-highlight').length + ' )';
        };

        $scope.replaceText = function () {
            $scope.runSearch();
            $noteContent.replaceHighlightedText($scope.textReplacement);
            updateNote($scope.note);
        };

        $scope.clearHighlight = function () {
            $noteContent.removeHighlight();
            updateNote($scope.note);
        };

        new AutoSuggest($noteContent[0]);
        focusOnTitle();
        initEvent();
    };
});
