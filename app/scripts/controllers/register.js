define(
  ['controllers/controllers', 'modals/askfast'],
  function (controllers, AskFast)
  {
    'use strict';

    controllers.controller ('register',
      [
        '$scope', '$rootScope', '$location', 'AskFast', 'Session', 'Store',
        function ($scope, $rootScope, $location, AskFast, Session, Store)
        {
          Store = Store('app');

          angular.element('body').addClass('register-0');

          $scope.data = {
            user: {
              name: {
                first:  '',
                last:   '',
                full:   function () { return this.first + ' ' + this.last }
              },
              email: '',
              phone: ''
            },
            passwords: {
              first:  '',
              second: ''
            },
            verification: {
              id:     null,
              code:   null,
              resent: false
            },
            agreed: false,
            validation: {
              name: {
                first:  false,
                last:   false
              },
              email:      false,
              userExists: false,
              passwords:  false,
              phone:      false
            },
            submitted:  false,
            error: {
              register: false,
              resent:   false,
              verify:   false
            }
          };

          $scope.step = {
            value: null,

            resolve: Number($location.hash().split('-')[1]),

            check: function (step) { return ((this.value === step)) },

            validate: function (step)
            {
              var result = true;

              switch (step)
              {
                case 1:
                  $scope.data.submitted = true;

                  $scope.data.validation.name.first = (($scope.data.user.name.first == ''));
                  $scope.data.validation.name.last  = (($scope.data.user.name.last == ''));
                  $scope.data.validation.email      = (($scope.data.user.email == ''));

                  $scope.data.validation.passwords = (
                    ($scope.data.passwords.first == '') || ($scope.data.passwords.second == '') ||
                    ($scope.data.passwords.first != $scope.data.passwords.second)
                  );

                  if ($scope.data.validation.first ||
                      $scope.data.validation.last ||
                      $scope.data.validation.email ||
                      $scope.data.validation.userExists ||
                      $scope.data.validation.passwords ||
                      !$scope.data.agreed)
                  {
                    result = false;
                  }
                  break;

                case 2:
                  break;

                case 3:
                  break;

                default:
              }

              return result;
            },

            forward: function ()
            {
              var current = this.value,
                  body    = angular.element('body');

              body.removeClass();

              switch (current)
              {
                case 1: body.addClass('register-0'); break;
                case 2: body.addClass('register-1'); break;
                case 3: body.addClass('register-2'); break;
                case 4: body.addClass('register-3'); break;
              }

              if (this.validate(current))
              {
                this.value = Number(current + 1);

                $location.hash('step-' + this.value);
              }

              $scope.data.verification.resent = false;
              $scope.data.error.register      = false;
              $scope.data.error.resent        = false;
              $scope.data.error.verify        = false;
            }
          };

          if (localStorage.hasOwnProperty('data.verification.id'))
          {
            $scope.step.value = 3;

            $location.hash('step-3');
          }

          $scope.step.value = $scope.step.resolve;

          $scope.register = function ()
          {
            AskFast.caller('register', {
              name:         $scope.data.user.name.full(),
              username:     $scope.data.user.email,
              password:     $scope.data.passwords.first,
              phone:        $scope.data.user.phone,
              verification: 'SMS'
            })
              .then(function (result)
              {
                if (!result.hasOwnProperty('error'))
                {
                  $scope.data.verification.id = result.verificationCode;

                  // TODO: Replace with Store
                  localStorage.setItem('data.verification.id', result.verificationCode);
                }
                else
                {
                  $scope.data.error.register = true;
                }
              });
          };

          var CHECK_USERNAME_DELAY = 500;

          $scope.userExists = function ()
          {
            if ($scope.checkUsername)
            {
              clearTimeout($scope.checkUsername);

              $scope.checkUsername = null;
            }

            $scope.checkUsername = setTimeout(function ()
            {
              $scope.checkUsername = null;

              if ($scope.registrationForm1.email.$valid)
              {
                AskFast.caller('userExists', { username: $scope.data.user.email })
                  .then(function (result)
                  {
                    $scope.data.validation.userExists = ((result.hasOwnProperty('error')));
                  });
              }

            }, CHECK_USERNAME_DELAY);
          };

          $scope.checkUsername = null;

          $scope.verify = function ()
          {
            AskFast.caller('registerVerify', {
              code: $scope.data.verification.code,
              id:   localStorage.getItem('data.verification.id') // TODO: Replace with Store
            })
              .then(function (result)
              {
                if (!result.hasOwnProperty('error'))
                {
                  localStorage.removeItem('data.verification.id');

                  $scope.step.forward();

                  $scope.sessionId = result['X-SESSION_ID'];
                }
                else
                {
                  $scope.data.verification.resent = false;

                  $scope.data.error.verify = true;
                }
              });
          };

          $scope.resend = function ()
          {
            AskFast.caller('resendVerify', {
              code:         localStorage.getItem('data.verification.id'), // TODO: Make Store
              verification: 'SMS'
            })
              .then(function (result)
              {
                if (!result.hasOwnProperty('error'))
                {
                  $scope.data.verification.resent = true;

                  $scope.data.error.verify = false;
                }
                else
                {
                  $scope.data.error.resent = true;
                }
              });
          };

          $scope.bootstrap = function ()
          {
            // $rootScope.session = result['X-SESSION_ID'];

            Session.set($scope.sessionId, true);

            // $scope.login.state = true;

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


        }
      ]
    );
  }
);