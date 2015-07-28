define(["require", "exports", 'modals/modals'], function (require, exports, modals) {
    'use strict';
    var AskFastService = modals.factory('AskFast', ["$resource", "$q", "$location", "$rootScope", "Log", function ($resource, $q, $location, $rootScope, Log) {
        var AskFast = $resource($rootScope.config.host + '/:first/:second/:third/:fourth', {}, {
            register: {
                method: 'GET',
                params: {
                    first: 'register',
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
                    first: 'user_exists',
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
                    first: 'login',
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
                    'limit': 100
                },
                isArray: true
            },
            ddrRecord: {
                method: 'GET',
                params: {
                    first: 'ddr',
                }
            },
            ddrTypes: {
                method: 'GET',
                params: {
                    first: 'ddr',
                    second: 'types'
                },
                isArray: true
            },
            log: {
                method: 'GET',
                params: {
                    first: 'log'
                },
                isArray: true
            },
            httpLog: {
                method: 'GET',
                params: {
                    first: 'httplog'
                },
                isArray: true
            },
            paymentMethods: {
                method: 'GET',
                params: {
                    first: 'paymentmethod'
                },
                isArray: true
            },
            newPayment: {
                method: 'POST',
                params: {
                    first: 'payment'
                }
            },
            getPayments: {
                method: 'GET',
                params: {
                    first: 'payment'
                },
                isArray: true
            }
        });
        AskFast.prototype.caller = function (proxy, params, data, callback) {
            var deferred = $q.defer();
            params = params || {};
            try {
                AskFast[proxy](params, data, function (result) {
                    if (callback && callback.success)
                        callback.success.call(this, result);
                    deferred.resolve(result);
                }, function (result) {
                    if (callback && callback.error)
                        callback.error.call(this, result);
                    deferred.resolve({
                        error: result
                    });
                });
            }
            catch (err) {
                Log.error(err);
            }
            return deferred.promise;
        };
        return new AskFast();
    }]);
    return AskFastService;
});
