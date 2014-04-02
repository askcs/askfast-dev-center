define(
  ['controllers/controllers', 'modals/askfast'],
  function (controllers, AskFast)
  {
    'use strict';

    controllers.controller ('login',
      [
        '$scope', '$rootScope', 'AskFast', 'Session', 'Store', '$location', 'MD5',
        function ($scope, $rootScope, AskFast, Session, Store, $location, MD5)
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

            AskFast.caller('login',
              {
                username: $scope.login.email,
                password: MD5($scope.login.password)
              },
              null,
              {
                success: function (result)
                {
                  if (result.hasOwnProperty('X-SESSION_ID'))
                  {
                    $scope.login.error = {
                      state:  false,
                      code:   null
                    };

                    Session.set(result['X-SESSION_ID']);

                    $scope.login.state = true;

                    AskFast.caller('info')
                      .then(function (info)
                      {
                        Store.save({
                          user: info
                        });

                        $rootScope.user = info;

                        $location.path('/home');
                      });
                  }
                },
                error: function (result)
                {
                  if ([400, 403, 404, 500].indexOf(result.status) >= 0)
                  {
                    console.log('falling in');

                    $scope.login.error = {
                      state:  true,
                      code:   result.status
                    };

                    console.warn('login error ->', $scope.login.error);

                    loginBtn.text('Login')
                      .removeAttr('disabled');
                  }
                }
              }
            );
          };
        }
      ]
    );
  }
);