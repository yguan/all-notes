/*jslint nomen: true*/
/*global $,define,require,angular,window */

(function () {
    'use strict';

    angular.module('angular-textedit', [])
        .directive("textedit", function () {

            return {
                restrict: "E",
                template:
                    '<div class="editor-toolbar" ng-mousedown="$event.preventDefault()">' +
                        '<span class="text-color-picker"></span>' +
                        '<span class="fa text-icon" data-cmd="bold" title="Bold (ctrl + b)">B</span>' +
                        '<span class="fa fa-italic" data-cmd="italic" title="Italic (ctrl + i)"></span>' +
                        '<span class="fa fa-underline" data-cmd="underline" title="Underline (ctrl + u)"></span>' +
                        '<span class="fa fa-strikethrough" data-cmd="strikeThrough" title="Strike Through"></span>' +
                        '<span class="fa fa-subscript" data-cmd="subscript" title="Subscript"></span>' +
                        '<span class="fa fa-superscript" data-cmd="superscript" title="Superscript"></span>' +
                        '<span class="fa fa-list-ol" data-cmd="insertOrderedList" title="Ordered List"></span>' +
                        '<span class="fa fa-list-ul" data-cmd="insertUnorderedList" title="Unordered List"></span>' +
                        '<span class="fa fa-indent" data-cmd="indent" title="Indent"></span>' +
                        '<span class="fa fa-outdent" data-cmd="outdent" title="Outdent"></span>' +
                        '<span class="fa fa-align-left" data-cmd="justifyleft" title="Left Justify"></span>' +
                        '<span class="fa fa-align-center" data-cmd="justifyCenter" title="Center Justify"></span>' +
                        '<span class="fa fa-align-right" data-cmd="justifyright" title="Right Justify"></span>' +
                        '<span class="fa fa-quote-left" data-cmd="formatBlock" data-arg="blockquote" title="Blockquote"></span>' +
                        '<span class="fa fa-eraser" data-cmd="removeFormat" title="Clear Format"></span>' +
                        '<span class="fa fa-minus" data-cmd="insertHorizontalRule" title="Horizontal Rule"></span>' +
                        '<span class="fa fa-undo" data-cmd="undo" title="Undo"></span>' +
                        '<span class="fa fa-repeat" data-cmd="redo" title="Redo"></span>' +
                    '</div>',
                controller: function () {
                    return {
                        init: function ($element, $scope) {
                            var me = this,
                                afterTextEditHandler = $scope.afterTextEditHandler;

                            $element.find('.text-color-picker').colorpicker({
                                size: 20,
                                hide: false,
                                onSelectColor: function (color) {
                                    me.execDocumentCmd('foreColor', color);
                                    if (afterTextEditHandler) {
                                        afterTextEditHandler();
                                    }
                                }
                            });

                            $element.click(function (e) {
                                me.execDocumentCmdWithAttr(e);
                                if (afterTextEditHandler) {
                                    afterTextEditHandler();
                                }
                            });
                        },

                        execDocumentCmdWithAttr: function (e) {
                            var $target = $(e.target),
                                command = $target.data('cmd'),
                                agrumentVal = $target.data('arg');

                            document.execCommand(command, false, agrumentVal);
                        },

                        execDocumentCmd: function (command, agrumentVal) {
                            document.execCommand(command, false, agrumentVal);
                        }
                    };
                },
                link: function ($scope, $element, attrs, controller) {
                    controller.init($element, $scope);
                }
            };
        });
}());