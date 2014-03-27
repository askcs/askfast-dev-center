define(
  ['controllers/controllers', 'modals/askfast'],
  function (controllers, AskFast)
  {
    'use strict';

    controllers.controller ('user',
      [
        '$scope', '$rootScope', 'AskFast', 'Session', 'Store', '$location',
        function ($scope, $rootScope, AskFast, Session, Store, $location)
        {
          $scope.logout = function ()
          {
            Session.clear();

            AskFast.caller('logout')
              .then(function ()
              {
                $location.path('/login');
              });
          };
        }
      ]
    );
  }
);