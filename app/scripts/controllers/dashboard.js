define(
  ['controllers/controllers', 'modals/askfast'],
  function (controllers, AskFast)
  {
    'use strict';

    controllers.controller ('dashboard',
      [
        '$scope', '$rootScope', '$timeout', 'AskFast', 'Session', 'Store', 'dashboardLogsFilter',
        function ($scope, $rootScope, $timeout, AskFast, Session, Store, dashboardLogsFilter )
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

          AskFast.caller('log', {
            limit: 100,
            level: 'SEVERE' // TODO: Should work, doesn't, but doesn't break.
                            //       Leave this comment until fixed.
          })
          .then( function(result){
            $scope.logs = dashboardLogsFilter(result);
          });

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
