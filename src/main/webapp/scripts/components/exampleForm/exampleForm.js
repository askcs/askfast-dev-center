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
            if (sessionStorage) {
                if (sessionStorage.getItem('exampleForm.' + scope.subject) !== null) {
                    var savedDetails = JSON.parse(sessionStorage.getItem('exampleForm.' + scope.subject));
                    savedDetails.destination ? scope.destination = savedDetails.destination : null;
                    savedDetails.url ? scope.url = savedDetails.url : null;
                    savedDetails.origin ? scope.origin = savedDetails.origin : null;
                }
                scope.$watchGroup(['destination', 'url', 'origin'], function (values) {
                    sessionStorage.setItem('exampleForm.' + scope.subject, JSON.stringify({
                        destination: values[0],
                        url: values[1],
                        origin: values[2]
                    }));
                });
            } // end if
            function submit(destination, url, origin) {
                scope.onSubmit()(destination, url, origin);
            }
        }
    }
});
