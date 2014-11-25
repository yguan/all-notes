/*jslint nomen: true*/
/*global $,define,require,angular,document */

define(function (require, exports, module) {
    'use strict';

    var notes = require('view/notes'),
        theme = require('view/theme'),
        isInitialized = false;

    function registerController(app, controller) {
        app.controller(controller.name, ['$scope', '$location', '$document', '$timeout', '$modal', '$sce', controller.controller]);
    }

    function configViewRouting(app) {
        app.config(function ($routeProvider, $locationProvider) {
            $routeProvider
                .when('/notes', {templateUrl: 'js/view/partial/notes.html', controller: notes.name})
                .otherwise({redirectTo: '/notes'});
        });
    }

    exports.init = function () {
        if (!isInitialized) {
            theme.init();

            var noteApp = angular.module('note', [
                'ngRoute',
                'ngSanitize',
                '$strap.directives',
                'angularFileUpload',
                'styling',
                'contenteditable',
                'colorpicker.module',
                'angular-textedit'
            ]);

            configViewRouting(noteApp);
            registerController(noteApp, notes);
            angular.bootstrap(document, ['note']);
            isInitialized = true;
        }
    };

});