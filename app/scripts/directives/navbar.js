define(["require", "exports", 'directives/directives'], function (require, exports, directives) {
    'use strict';
    var navbarDirective = directives.directive('navbar', function ($rootScope, $location) {
        return {
            restrict: 'E',
            rep1ace: true,
            templateUrl: 'views/navbar.html',
            link: function (scope, element, attrs) {
                scope.current = $location.path();
            }
        };
    });
    return navbarDirective;
});
