/// <reference path="../typings/angularjs/angular.d.ts"/>
import directives = require('directives/directives');
    'use strict';

interface ICustomScope extends ng.IScope {
  labelResponseCode: string;
}

var labelResponseCodeDirective = directives.directive('labelResponseCode',
  function ()
  {
    return {
      restrict: 'A',
      scope: {
        labelResponseCode: '@'
      },
      link: function (scope:ICustomScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes)
      {
        switch(scope.labelResponseCode){
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

  }
);

export = labelResponseCodeDirective;
