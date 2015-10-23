/// <reference path="../../typings/angularjs/angular.d.ts"/>
define(['angular', 'app'], function (angular) {
    'use strict';
    angular.module('AskFast')
        .directive('exampleForm', exampleForm);
    function exampleForm() {
        var directive = {
            restrict: 'E',
            scope: {
                subject: '@',
                action: '@',
                onSubmit: '&',
                dialogs: '=',
                adapters: '='
            },
            templateUrl: 'scripts/components/exampleForm/exampleForm.html',
            link: exampleFormLink
        };
        return directive;
        function exampleFormLink(scope, iElement, iAttrs) {
            scope.submit = submit;
            function submit(destination, url, origin) {
                scope.onSubmit()(destination, url, origin);
            }
        }
    }
});
