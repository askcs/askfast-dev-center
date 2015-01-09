define(
<<<<<<< HEAD
    ['modals/modals'],
    function(modals) {
        'use strict';

        modals.factory('AskFast', [
            '$resource', '$q', '$location', '$rootScope', 'Log',
            function($resource, $q, $location, $rootScope, Log) {
                var AskFast = $resource(
                    $rootScope.config.host + '/:action/:level/:node/:extra', {}, {
                        register: {
                            method: 'GET',
                            params: {
                                action: 'register',
                                name: '',
                                username: '',
                                password: '',
                                phone: '',
                                verification: ''
                            }
                        },
                        userExists: {
                            method: 'GET',
                            params: {
                                action: 'user_exists',
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
                                action: 'login',
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

                        forgotPass: {
                            method: 'PUT',
                            params: {
                                action: 'info',
                                level: 'forgot_password',
                                node: ''
                            }
                        },
                        changePass: {
                            method: 'PUT',
                            params: {
                                action: 'info',
                                level: 'forgot_password',
                                node: 'verify',
                                extra: '',
                                code: '',
                                password: ''
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
                            },
                            isArray: true
                        },
                        createDialog: {
                            method: 'POST',
                            params: {
                                action: 'dialog'
                            }
                        },
                        updateDialog: {
                            method: 'PUT',
                            params: {
                                action: 'dialog',
                                level: ''
                            }
                        },
                        deleteDialog: {
                            method: 'DELETE',
                            params: {
                                action: 'dialog'
                            }
                        },

                        getAdapters: {
                            method: 'GET',
                            params: {
                                action: 'adapter'
                            },
                            isArray: true
                        },
                        createAdapter: {
                            method: 'POST',
                            params: {
                                action: 'adapter',
                                level: ''
                            }
                        },
                        updateAdapter: {
                            method: 'PUT',
                            params: {
                                action: 'adapter',
                                level: ''
                            }
                        },
                        removeAdapter: {
                            method: 'DELETE',
                            params: {
                                action: 'adapter',
                                level: ''
                            }
                        },
                        freeAdapters: {
                            method: 'GET',
                            params: {
                                action: 'free_adapters'
                            },
                            isArray: true
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

                        ddr: {
                            method: 'GET',
                            params: {
                                action: 'ddr',
                                'limit': 100
                            },
                            isArray: true
                        },
                        log: {
                            method: 'GET',
                            params: {
                                action: 'log'
                            },
                            isArray: true
                        },
                        paymentMethods:{
                          method :'GET',
                          params: {
                            action:'paymentmethod'
                          },
                          isArray: true
                        },
                        newPayment:{
                            method: 'POST',
                            params: {
                                action: 'payment'
                            }
                        },
                        getPayments: {
                            method: 'GET',
                            params: {
                                action: 'payment'
                            },
                            isArray: true
                        }
                    }
                );

                AskFast.prototype.caller = function(proxy, params, data, callback) {
                    var deferred = $q.defer();

                    params = params || {};

                    try {
                        AskFast[proxy](
                            params,
                            data,
                            function(result) {
                                if (callback && callback.success) callback.success.call(this, result);

                                deferred.resolve(result);
                            },
                            function(result) {
                                if (callback && callback.error) callback.error.call(this, result);

                                deferred.resolve({
                                    error: result
                                });
                            }
                        );
                    } catch (err) {
                        Log.error(err);
                    }

                    return deferred.promise;
                };

                return new AskFast();
=======
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
            $rootScope.config.host + '/:first/:second/:third/:fourth',
            {},
            {
              register: {
                method: 'GET',
                params: {
                  first:   'register',
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
                  first:   'user_exists',
                  username: ''
                }
              },
              registerVerify: {
                method: 'GET',
                params: {
                  first: 'register_verify',
                  id: '',
                  code: ''
                }
              },
              resendVerify: {
                method: 'GET',
                params: {
                  first: 'resend_verify',
                  code: '',
                  verification: ''
                }
              },

              login: {
                method: 'GET',
                params: {
                  first:   'login',
                  username: '',
                  password: ''
                }
              },
              logout: {
                method: 'GET',
                params: {
                  first: 'logout'
                }
              },

              forgotPass: {
                method: 'PUT',
                params: {
                  first: 'info',
                  second: 'forgot_password',
                  third: ''
                }
              },
              changePass: {
                method: 'PUT',
                params: {
                  first: 'info',
                  second: 'forgot_password',
                  third: 'verify',
                  fourth: '',
                  code: '',
                  password: ''
                }
              },

              authorizedApp: {
                method: 'GET',
                params: {
                  first: 'authorized_app'
                }
              },

              info: {
                method: 'GET',
                params: {
                  first: 'info'
                }
              },

              getDialog: {
                method: 'GET',
                params: {
                  first: 'dialog'
                },
                isArray: true
              },
              createDialog: {
                method: 'POST',
                params: {
                  first: 'dialog'
                }
              },
              updateDialog: {
                method: 'PUT',
                params: {
                  first: 'dialog',
                  second: ''
                }
              },
              deleteDialog: {
                method: 'DELETE',
                params: {
                  first: 'dialog'
                }
              },

              getAdapters: {
                method: 'GET',
                params: {
                  first: 'adapter'
                },
                isArray: true
              },
              createAdapter: {
                method: 'POST',
                params: {
                  first: 'adapter',
                  second: ''
                }
              },
              updateAdapter: {
                method: 'PUT',
                params: {
                  first: 'adapter',
                  second: ''
                }
              },
              removeAdapter: {
                method: 'DELETE',
                params: {
                  first: 'adapter',
                  second: ''
                }
              },
              freeAdapters: {
                method: 'GET',
                params: {
                  first: 'free_adapters'
                },
                isArray: true
              },

              key: {
                method: 'GET',
                params: {
                  first: 'key'
                }
              },
              getAccessToken: {
                method: 'POST',
                params: {
                  first: 'keyserver',
                  second: 'token'
                }
              },

			   ddr: {
                method: 'GET',
                params: {
                  first: 'ddr',
				  'limit':100
                },
				isArray: true
              },
              log: {
                method: 'GET',
                params: {
                  first: 'log'
                },
                isArray: true
              }
>>>>>>> creditTest
            }
        ]);
    }
);
