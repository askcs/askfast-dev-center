define(["require", "exports", './directives'], function (require, exports, directives) {
    'use strict';
    var appVersionDirective = directives.directive('appVersion', function (version) {
        return function (scope, elm, attrs) {
            elm.text(version);
        };
    });
    return appVersionDirective;
});
