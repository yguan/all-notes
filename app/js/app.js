/*jslint nomen: true*/
/*global $,define,require */

require.config({
    baseUrl: 'js',
    paths: {
        data: './data',
        view: './view',
        partial: './view/partial',
        extension: './extension',
        lib: './lib'
    }
});

require([
    'lib/lodash.underscore',
    'lib/jquery',
    'lib/auto-suggest',
    'lib/angular/angular'
],
function () {
    require([
        'extension/lodash.underscore',
        'lib/angular/angular-route',
        'lib/angular/angular-sanitize',
        'lib/angular/angular-mobile',
        'lib/angular/bootstrap',
        'lib/angular/angular-strap',
        'lib/angular/angular-contenteditable',
        'lib/angular/angular-file-upload',
        'lib/angular/angular-text-edit',
        'lib/angular/styling',
        'lib/angular/bootstrap-colorpicker',
        'lib/angular/jquery.colorpicker'
    ],
    function () {
        require(['data/app-data-loader', 'view/all-views'], function (loader, views) {
            'use strict';

            loader.init({
                success: views.init,
                failure: views.init
            });

            require(['lib/auto-suggest-words']);
        });
    });
});

