define(["require", "exports", 'directives/directives'], function (require, exports, directives) {
    'use strict';
    var appVersionDirective = directives.directive('appVersion', ["version", function (version) {
        return function (scope, elm, attrs) {
            elm.text(version);
        };
    }]);
    return appVersionDirective;
});
