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

          return new AskFast();
        }
      ]
    );
  }
);