import directives = require('directives/directives');
    'use strict';

interface ICustomScope extends ng.IScope {
    current: string;
}

var navbarDirective = directives.directive('navbar',
  function ($rootScope, $location)
  {
    return {
      restrict: 'E',
      rep1ace:  true,
      templateUrl: 'views/navbar.html',
      link: function (scope:ICustomScope, element, attrs)
      {
        scope.current = $location.path();
      }
    };

  }
);

export = navbarDirective;
