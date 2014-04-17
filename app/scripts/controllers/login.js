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

          var login = Store('app').get('login');

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

            Store('app').save({
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

                    /**
                     * Build core cache
                     */
                    AskFast.caller('info')
                      .then(function (info)
                      {
                        /**
                         * creationTime: 1395145568131
                         * email: null
                         * id: "8b559620"
                         * name: "Cengiz Ulusoy"
                         * password: "eadeb7"
                         * phoneNumber: "0629143142"
                         * status: "ACTIVE"
                         * userName: "cengiz@ask-cs.com"
                         */
                        AskFast.caller('key')
                          .then(function(keys)
                          {
                            /**
                             * accountId: "8b559620"
                             * refreshToken: "d4637ec"
                             */
                            if (keys.accountId == info.id)
                              info.refreshToken = keys.refreshToken;

                            Store('app').save({
                              user: info
                            });

                            $rootScope.user = info;

                            $location.path('/dashboard');
                          });
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