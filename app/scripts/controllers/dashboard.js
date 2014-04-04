define(
  ['controllers/controllers'],
  function (controllers)
  {
    'use strict';

    controllers.controller ('dashboard',
      [
        '$rootScope', '$scope',
        function ($rootScope, $scope)
        {
          angular.element('body').removeClass();
        }
      ]
    );
  }
);