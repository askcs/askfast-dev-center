define(
  ['directives/directives'],
  function (directives)
  {
    'use strict';

    directives.directive('navbar',
      [
        '$rootScope', '$location',
        function ($rootScope, $location)
        {
          return {
            restrict: 'E',
            rep1ace:  true,
            templateUrl: 'views/navbar.html',
            link: function (scope, element, attrs)
            {
              scope.user = $rootScope.user;

              scope.current = $location.path();
            },
            scope: {}
          };

        }
      ]
    );
  }
);
