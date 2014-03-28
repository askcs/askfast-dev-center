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
          $('body').removeClass();
        }
      ]
    );
  }
);