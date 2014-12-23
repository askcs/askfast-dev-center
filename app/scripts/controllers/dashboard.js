define(
  ['controllers/controllers', 'modals/askfast'],
  function (controllers, AskFast)
  {
    'use strict';

    controllers.controller ('dashboard',
      [
        '$scope', '$rootScope', 'AskFast', 'Session', 'Store',
        function ($scope, $rootScope, AskFast, Session, Store )
        {
          $scope.keyRevealTypeString = 'password';
          $scope.keyButtonString = 'Show';

          $scope.toggleKeyReveal = function () {
            if ($scope.keyRevealTypeString == 'password'){
              $scope.keyRevealTypeString = 'text';
              $scope.keyButtonString = 'Hide';
            }
            else {
              $scope.keyRevealTypeString = 'password';
              $scope.keyButtonString = 'Show';
            }
          };

          AskFast.caller('info')
          .then(function (info)
          {
            AskFast.caller('key')
            .then(function (keys)
            {
              info.refreshToken = keys.refreshToken;

              Store('app').save({
                user: info
              });

              $rootScope.user = Store('app').get('user');
            });

          });

        }
      ]
    );
  }
);
