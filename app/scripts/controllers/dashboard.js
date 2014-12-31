define(
  ['controllers/controllers', 'modals/askfast'],
  function (controllers, AskFast)
  {
    'use strict';

    controllers.controller ('dashboard',
      [
        '$scope', '$rootScope', '$timeout', 'AskFast', 'Session', 'Store',
        function ($scope, $rootScope, $timeout, AskFast, Session, Store )
        {
          var keyRevealTimeoutPromise = null;
          $scope.keyRevealTypeString = 'password';
          $scope.keyButtonString = 'Show';

          $scope.toggleKeyReveal = function () {
            if ($scope.keyRevealTypeString == 'password'){
              $scope.keyRevealTypeString = 'text';
              $scope.keyButtonString = 'Hide';

              keyRevealTimeoutPromise = $timeout(function() {
                $scope.toggleKeyReveal();
              }, 5000)
            }
            else {
              if (keyRevealTimeoutPromise){
                $timeout.cancel(keyRevealTimeoutPromise);
                keyRevealTimeoutPromise = null;
              }

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
