define(
  ['modals/modals'],
  function (modals)
  {
    'use strict';

    modals.factory('AskFast',
      [
        '$resource', '$q', '$location', '$rootScope', 'Storage', 'Session', 'MD5',
        function ($resource, $q, $location, $rootScope, Storage, Session, MD5)
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
              }
            }
          );


          var Contact = $resource(
            'http://char-a-lot.appspot.com/rpc',
            {},
            {
              request: {
                method: 'POST',
                params: {}
              }
            }
          );


          /**
           * User login
           */
          AskFast.prototype.login = function (data)
          {
            var deferred = $q.defer();

            AskFast.login(
              {
                username: data.email,
                password: MD5(data.password)
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
           * /user_exists?username={preferred_username}

           returns a 200 if it doesn't exists and a 409 if it does.
           * @type {*}
           */


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
                code:     data.verification.code,
                id:       localStorage.getItem('data.verification.id')
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
                code:         localStorage.getItem('data.verification.id'),
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
           * Contact form
           */
          AskFast.prototype.contact = function (contact)
          {
            var deferred = $q.defer();

            var data = {
              message: contact.message,
              sender: contact.name + ' ' +
                      contact.surname + ' <' +
                      contact.email + '>',
              subject: 'New message from AskFast, related to: ' + contact.subject
            };

            Contact.request(
              {},
              {
                "method": "outboundCallWithMap",
                "params": {
                  "adapterID": "2dbe5b60-154a-11e3-b728-00007f000001",
                  "addressMap": {
                    "abektes@ask-cs.com": "Contact Inquiry"
                  },
                  "url": "http://askfastmarket1.appspot.com/resource/question/comment?message=" +
                    encodeURIComponent(data.message),
                  "publicKey": 	"",
                  "privateKey": 	"",
                  "senderName": data.sender,
                  "subject": 	data.subject
                }
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


          return new AskFast();
        }
      ]
    );
  }
);