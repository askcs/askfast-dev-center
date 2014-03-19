'use strict';

define(
  [
    'angular',
    'modals/modals',
    'controllers/controllers',
    'services/services',
    'filters/filters',
    'directives/directives',
    'angular-resource',
    'angular-route'
  ],
  function (angular)
  {
    return angular.module('DevCen',
      [
        'modals',
        'controllers',
        'services',
        'filters',
        'directives',
        'ngResource',
        'ngRoute'
      ]);
  }
);