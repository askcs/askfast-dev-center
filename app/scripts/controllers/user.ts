/// <reference path="../typings/angularjs/angular.d.ts"/>
/// <reference path="../typings/bootstrap/bootstrap.d.ts"/>
import controllers = require('controllers/controllers');
'use strict';

var userController = controllers.controller ('user',
  function ($scope, $rootScope, $routeParams, AskFast, Session, Store, $location, MD5)
  {
    var chPasswordId, chPasswordCode;


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
      state: false,
      forgot: false,
      changePass: false,
      notification: ''
    };

    if ($routeParams.code && $routeParams.id){
      chPasswordId = $routeParams.id;
      chPasswordCode = $routeParams.code;

      $scope.login.changePass = true;
    }

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

              AskFast.caller('info')
                .then(function (info)
                {
                AskFast.caller('getAdapters')
                  .then(function(adapters)
                  {
                      var adapterMap =  {};
                      angular.forEach(adapters, function (adapter)
                      {
                          adapterMap[adapter.configId] =  adapter.adapterType;
                      });
                      Store('data').save(adapterMap, 'adapterMap');
                      // Store('data').save(adapters, 'adapters');


                    AskFast.caller('ddrTypes', {
                    }).then(function(ddrTypes){

                      var ddrTypeCategories =
                      {
                        "OUTGOING_COMMUNICATION_COST": "Outgoing",
                        "ADAPTER_PURCHASE": "Adapter Purchase",
                        "INCOMING_COMMUNICATION_COST": "Incoming",
                        "SERVICE_COST": "Service Cost",
                        "SUBSCRIPTION_COST": "Subscription Cost",
                        "START_UP_COST": "Start Up Cost",
                        "TTS_COST": "TTS Cost",
                        "TTS_SERVICE_COST": "TTS Service Cost"
                      };

                      var ddrTypesObject = {};

                      angular.forEach(ddrTypes, function(ddrType){
                        ddrTypesObject[ddrType.typeId] = {
                          name: ddrType.name,
                          category: ddrType.category,
                          categoryString: ddrTypeCategories[ddrType.category]
                        };
                      });

                      Store('data').save(ddrTypesObject,'ddrTypes');

                  AskFast.caller('key')
                    .then(function(keys)
                    {
                      if (keys.accountId == info.id)
                        info.refreshToken = keys.refreshToken;

                      Store('app').save({
                        user: info
                      });

                      $rootScope.user = info;

                      angular.element('body')
                        .removeClass()
                        .css({'backgroundColor': '#454545'});

                      if ($location.search().redirect_url)
                      {
                        window.location.href = $location.search().redirect_url;
                      }
                      else
                      {
                        $location.path('/dashboard');
                      }
                    });


                    });



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

    $scope.logout = function ()
    {
      Session.clear();

      AskFast.caller('logout')
        .then(function ()
        {
          $location.path('/login');
        });
    };

    // angular.element('body').addClass('register-0');

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
        email:        $scope.data.user.email,
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

    $scope.forgotPass = function() {
      loginBtn.attr('disabled', 'disabled');

      // Reset password from login view
      $scope.login.password = '';

      AskFast.caller('forgotPass', {
        third: $scope.login.email,
        guiForwardLink: $location.absUrl()
      }).then( function(result){
        if (!result.hasOwnProperty('error')){

          // Reset used properties
          $scope.login.email = '';
          $scope.login.notification = 'Password reset request sent succesfully, please check your email.';
          $scope.login.forgot = false;
          loginBtn.removeAttr('disabled');

          setTimeout(function(){
            $scope.$apply(function(scope){
              // Remove notification
              scope.login.notification = '';
            });
          }, 5000);
        }
        else {
          $scope.login.notification = 'Something went wrong with the reset request, check the email address and try again';
          loginBtn.removeAttr('disabled');
        }
      });
    };

    $scope.changePass = function() {
      loginBtn.attr('disabled', 'disabled');

      $scope.data.submitted = true;

      $scope.data.validation.passwords = (
        ($scope.data.passwords.first == '') || ($scope.data.passwords.second == '') ||
        ($scope.data.passwords.first != $scope.data.passwords.second)
        );

      if ($scope.data.validation.passwords){
        loginBtn.text('Submit New Password')
                .removeAttr('disabled');
      }
      else {


        AskFast.caller('changePass',{
          fourth: chPasswordId,
          code: chPasswordCode,
          password: MD5($scope.data.passwords.first)
        })
        .then(function(result){
          if (!result.hasOwnProperty('error'))
          {
            $scope.login.notification = 'Password succesfully changed.';
            //Reset used properties
            $scope.data.passwords = {
              first: '',
              second: ''
            };
            $scope.data.validation.passwords = false;
            //Go to login
            $scope.login.changePass = false;
            loginBtn.removeAttr('disabled');

            setTimeout(function(){
              $scope.$apply(function(scope){
                // Remove notification
                scope.login.notification = '';
              });
            }, 5000);
          }
          else {
            loginBtn.removeAttr('disabled');
            $scope.login.notification = 'Something went wrong when changing the password';
          }

        });
      }

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
          Store('app').save({
            user: info
          });

          $rootScope.user = info;

          $location.path('/home');
        });
    }


  }
);
export = userController;
