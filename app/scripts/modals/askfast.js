define(
  ['modals/modals'],
  function (modals)
  {
    'use strict';

    modals.factory('AskFast',
      [
        '$resource', '$q', '$location', '$rootScope', 'Log',
        function ($resource, $q, $location, $rootScope, Log)
        {
          var AskFast = $resource(
            $rootScope.config.host + '/:action/:level',
            {},
            {
              register: {
                method: 'GET',
                params: {
                  action:   'register',
                  name:     '',
                  username: '',
                  password: '',
                  phone:    '',
                  verification: ''
                }
              },
              userExists: {
                method: 'GET',
                params: {
                  action:   'user_exists',
                  username: ''
                }
              },
              registerVerify: {
                method: 'GET',
                params: {
                  action: 'register_verify',
                  id: '',
                  code: ''
                }
              },
              resendVerify: {
                method: 'GET',
                params: {
                  action: 'resend_verify',
                  code: '',
                  verification: ''
                }
              },
              login: {
                method: 'GET',
                params: {
                  action:   'login',
                  username: '',
                  password: ''
                }
              },
              logout: {
                method: 'GET',
                params: {
                  action: 'logout'
                }
              },
              authorizedApp: {
                method: 'GET',
                params: {
                  action: 'authorized_app'
                }
              },
              info: {
                method: 'GET',
                params: {
                  action: 'info'
                }
              },
              getDialog: {
                method: 'GET',
                params: {
                  action: 'dialog'
                }
              },
              createDialog: {
                method: 'POST',
                params: {
                  action: 'dialog'
                }
              },
              getAdapters: {
                method: 'GET',
                params: {
                  action: 'adapter'
                }
              },
              createAdapter: {
                method: 'POST',
                params: {
                  action: 'adapter',
                  id: ''
                }
              },
              freeAdapters: {
                method: 'GET',
                params: {
                  action: 'free_adapters'
                }
              },
              key: {
                method: 'GET',
                params: {
                  action: 'key'
                }
              },
              getAccessToken: {
                method: 'POST',
                params: {
                  action: 'keyserver',
                  level: 'token'
                }
              },
              logs: {
                method: 'GET',
                params: {
                  action: 'log'
                }
              }
            }
          );


          /**
           * REST Call engine
           */
          AskFast.prototype.caller = function (proxy, params, data, success, error)
          {
            var deferred = $q.defer();

            params = params || {};

            try
            {
              AskFast[proxy](
                params,
                data,
                function (result)
                {
                  if (success) success.call();

                  deferred.resolve(result);
                },
                function (err)
                {
                  if (error) error.call(err);

                  deferred.resolve({error: err});
                }
              );
            }
            catch (err)
            {
              Log.error(err);
            }

            return deferred.promise;
          };





          /**
           * User registration
           */
          AskFast.prototype.register = function (data)
          {
            var deferred = $q.defer();

            AskFast.register(
              {
                name:         data.user.name.full(),
                username:     data.user.email,
                password:     data.passwords.first,
                phone:        data.user.phone,
                verification: 'SMS'
              },
              function (result)
              {
                deferred.resolve(result);
              },
              function (error)
              {
                deferred.resolve({error: error});
              }
            );

            return deferred.promise;
          };


          /**
           * Check whet username already exists
           */
          AskFast.prototype.userExists = function (username)
          {
            var deferred = $q.defer();

            AskFast.userExists(
              {
                username: username
              },
              function (result)
              {
                deferred.resolve(result);
              },
              function (error)
              {
                deferred.resolve({error: error});
              }
            );

            return deferred.promise;
          };


          /**
           * User registration verify
           */
          AskFast.prototype.verify = function (data)
          {
            var deferred = $q.defer();

            AskFast.registerVerify(
              {
                code: data.verification.code,
                id:   localStorage.getItem('data.verification.id') // TODO: Make Store
              },
              function (result)
              {
                deferred.resolve(result);
              },
              function (error)
              {
                deferred.resolve({error: error});
              }
            );

            return deferred.promise;
          };


          /**
           * User registration verify
           */
          AskFast.prototype.resend = function ()
          {
            var deferred = $q.defer();

            AskFast.resendVerify(
              {
                code:         localStorage.getItem('data.verification.id'), // TODO: Make Store
                verification: 'SMS'
              },
              function (result)
              {
                deferred.resolve(result);
              },
              function (error)
              {
                deferred.resolve({error: error});
              }
            );

            return deferred.promise;
          };


          /**
           * User logout
           */
          AskFast.prototype.logout = function ()
          {
            var deferred = $q.defer();

            AskFast.process(null,
              function (result)
              {
                deferred.resolve(result);
              },
              function (error)
              {
                deferred.resolve({error: error});
              }
            );

            return deferred.promise;
          };


          /**
           * Get user information
           */
          AskFast.prototype.info = function ()
          {
            var deferred = $q.defer();

            AskFast.info(null,
              function (result)
              {
                deferred.resolve(result);
              },
              function (error)
              {
                deferred.resolve({error: error});
              }
            );

            return deferred.promise;
          };


          /**
           * Get user logs
           */
          AskFast.prototype.logs = function ()
          {
            var deferred = $q.defer();

            AskFast.logs(null,
              function (result)
              {
                deferred.resolve(result);
              },
              function (error)
              {
                deferred.resolve({error: error});
              }
            );

            return deferred.promise;
          };


          return new AskFast();
        }
      ]
    );
  }
);