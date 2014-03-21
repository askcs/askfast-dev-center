define(
  ['controllers/controllers', 'modals/askfast'],
  function (controllers, AskFast)
  {
    'use strict';

    controllers.controller ('login',
      [
        '$scope', '$rootScope', 'AskFast', 'Session', 'Store',
        function ($scope, $rootScope, AskFast, Session, Store)
        {
          Store = Store('app');

          $scope.login = {
            email: '',
            password: '',
            validation: {
              email: false,
              password: false
            },
            error: {
              state:  false,
              code:   null
            },
            state: false
          };

          var loginBtn = angular.element('#login button[type=submit]');

          var login = Store.get('login');

          if (login && login.remember)
          {
            $scope.login.email     = login.email;
            $scope.login.password  = login.password;
            $scope.login.remember  = login.remember;
          }

          $scope.auth = function ()
          {
            loginBtn.text('Login..')
                    .attr('disabled', 'disabled');

            Store.save({
              login: {
                email:    $scope.login.email,
                password: $scope.login.password,
                remember: $scope.login.remember
              }
            });

            AskFast.login($scope.login)
              .then(function (result)
              {
                if ([400, 403, 404, 500].indexOf(result.status) < 0)
                {
                  $scope.login.error = {
                    state:  true,
                    code:   result.status
                  };

                  loginBtn.text('Login')
                          .removeAttr('disabled');
                }

                if (result.hasOwnProperty('X-SESSION_ID'))
                {
                  $scope.login.error = {
                    state:  false,
                    code:   null
                  };

                  Session.set(result['X-SESSION_ID']);

                  $scope.login.state = true;
                }

              });
          };

        }
      ]
    );
  }
);