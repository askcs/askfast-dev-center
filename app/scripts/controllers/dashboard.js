define(["require", "exports", 'controllers/controllers'], function (require, exports, controllers) {
    'use strict';
    var dashboardController = controllers.controller('dashboard', function ($scope, $rootScope, $timeout, $http, AskFast, Session, Store, dashboardLogsFilter, $q) {
        var keyRevealTimeoutPromise = null;
        var bearerToken = '';
        $scope.keyRevealTypeString = 'password';
        $scope.keyButtonString = 'Show';
        $scope.loading = {
            logs: true
        };
        //sms widget
        //Save all the posible adapters in the scope
        var smsAdapters = [];
        var phoneAdapters = [];
        angular.forEach(Store('data').get('adapterDetails'), function (value, key) {
            if (value.adapterType === 'sms') {
                smsAdapters.push(value);
            }
            if (value.adapterType === 'call') {
                phoneAdapters.push(value);
            }
        });
        $scope.smsAdapters = smsAdapters;
        $scope.phoneAdapters = phoneAdapters;
        //grab dialogs to show  list
        AskFast.caller('getDialog')
            .then(function (dialogs) { $scope.dialogs = dialogs; });
        $scope.sendSMS = function () {
            var message = {
                type: 'sms',
                to: $scope.sms.to,
                url: $scope.sms.url,
                from: $scope.sms.from
            };
            //check if there is a bearer token present before sending
            checkToken(message)
                .then(function (result) {
                console.log(result);
            });
        };
        //Phone widget
        $scope.startCall = function () {
            var message = {
                type: 'call',
                from: $scope.call.from,
                url: $scope.call.url,
                to: $scope.call.to
            };
            //check if there is a bearer token present before sending
            checkToken(message).then(function (result) {
                console.log(result);
            });
        };
        /**
         * Send message
         * @param  {JSON} message {type: xxxx, to: xxx, url: xxxx}
         * @return {Promise}
         */
        function sendMessage(message) {
            var deferd = $q.defer();
            var dialog = {
                address: message.to,
                url: message.url,
            };
            if (message.from) {
                dialog.adapterID = message.from.configId;
            }
            else {
                dialog.adapterType = message.type;
            }
            var req = {
                method: 'POST',
                url: $rootScope.config.host + '/startDialog/outbound',
                headers: {
                    'Authorization': 'Bearer ' + bearerToken
                },
                data: dialog
            };
            $http(req)
                .success(function (data, status, headers, config) {
                deferd.resolve(data);
                $scope.alert = "Successful request, see your request below";
                var request = {
                    host: $rootScope.config.host,
                    path: 'startDialog/outbound',
                    header: {
                        Authorization: 'Bearer ' + bearerToken
                    },
                    payload: dialog
                };
                $scope.request = JSON.stringify(request, null, 2);
            })
                .error(function (data, status, headers, config) {
                deferd.reject(data);
                $scope.alert = "Something went wrong, please try again later. Check the logs and request below";
                var request = {
                    host: $rootScope.config.host,
                    path: 'startDialog/outbound',
                    header: {
                        Authorization: 'Bearer ' + bearerToken
                    },
                    payload: dialog
                };
                $scope.request = JSON.stringify(request, null, 2);
            });
            return deferd.promise;
        }
        // check if there is a bear token, if there is: send message. If there is no bearer, fetch bearer and send message
        function checkToken(message) {
            var deferred = $q.defer();
            if (bearerToken != '') {
                sendMessage(message).then(function (response) {
                    deferred.resolve(response);
                });
            }
            else {
                getBearer().then(function (result) {
                    sendMessage(message);
                });
            }
            return deferred.promise;
        }
        function getBearer() {
            console.log('fetch bearerToken');
            //set proper header
            Session.setHeader('application/x-www-form-urlencoded');
            var deferd = $q.defer();
            AskFast.caller('getAccessToken', null, $.param({
                client_id: $scope.user.id,
                grant_type: 'refresh_token',
                refresh_token: $scope.user.refreshToken,
                client_secret: 'none'
            })).then(function (result) {
                if (!result.error) {
                    Session.setHeader('application/json');
                    bearerToken = result.access_token;
                    deferd.resolve();
                }
                else {
                    console.log('bear rejected');
                    console.log(result);
                    deferd.reject(result);
                }
            });
            return deferd.promise;
        }
        $scope.toggleKeyReveal = function () {
            if ($scope.keyRevealTypeString == 'password') {
                $scope.keyRevealTypeString = 'text';
                $scope.keyButtonString = 'Hide';
                keyRevealTimeoutPromise = $timeout(function () {
                    $scope.toggleKeyReveal();
                }, 5000);
            }
            else {
                if (keyRevealTimeoutPromise) {
                    $timeout.cancel(keyRevealTimeoutPromise);
                    keyRevealTimeoutPromise = null;
                }
                $scope.keyRevealTypeString = 'password';
                $scope.keyButtonString = 'Show';
            }
        };
        AskFast.caller('log', {
            limit: 100,
            level: 'SEVERE' // TODO: Should work, doesn't, but doesn't break.
        })
            .then(function (result) {
            $scope.logs = dashboardLogsFilter(result);
            $scope.loading.logs = false;
        });
        AskFast.caller('info')
            .then(function (info) {
            AskFast.caller('key')
                .then(function (keys) {
                info.refreshToken = keys.refreshToken;
                Store('app').save({
                    user: info
                });
                $rootScope.user = Store('app').get('user');
            });
        });
    });
    return dashboardController;
});
