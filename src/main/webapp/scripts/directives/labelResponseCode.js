define(["require", "exports", './directives'], function (require, exports, directives) {
    'use strict';
    var labelResponseCodeDirective = directives.directive('labelResponseCode', function () {
        return {
            restrict: 'A',
            scope: {
                labelResponseCode: '@'
            },
            link: function (scope, element, attrs) {
                switch (scope.labelResponseCode) {
                    case '-1':
                        element.addClass('label-danger');
                        break;
                    case '200':
                        element.addClass('label-success');
                        break;
                    case '301':
                    case '302':
                    case '303':
                    case '304':
                    case '307':
                        element.addClass('label-primary');
                        break;
                    case '400':
                    case '401':
                    case '403':
                    case '404':
                        element.addClass('label-danger');
                        break;
                    case '500':
                    case '501':
                    case '502':
                    case '503':
                        element.addClass('label-danger');
                        break;
                    default:
                        element.addClass('label-default');
                        break;
                }
            }
        };
    });
    return labelResponseCodeDirective;
});
