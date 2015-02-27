define(
  ['controllers/controllers', 'modals/askfast'],
  function(controllers, AskFast) {
    'use strict';

    controllers.controller('dashboard', [
      '$scope', '$rootScope', '$timeout', 'AskFast', 'Session', 'Store', 'dashboardLogsFilter', '$q',
      function($scope, $rootScope, $timeout, AskFast, Session, Store, dashboardLogsFilter,$q) {
        var keyRevealTimeoutPromise = null;
        var bearerToken = '1ff8fff590dcd7a49eca80f506e02cc1';
        $scope.keyRevealTypeString = 'password';
        $scope.keyButtonString = 'Show';

        $scope.loading = {
          logs: true
        };

        //sms widget
        //Save all the posible adapters in the scope
        var  smsAdapters= [];
        var phoneAdapters = []
        angular.forEach(Store('adapters').all(), function(value, key) {
          if(value.adapterType === 'sms'){
            smsAdapters.push(value);
          }
          if(value.adapterType === 'call'){
            phoneAdapters.push(value);
          }
        })
        $scope.smsAdapters = smsAdapters
        $scope.phoneAdapters = phoneAdapters;

        $scope.sendSMS = function() {
          var message = {
              type :'sms',
              to: $scope.sms.to,
              url: $scope.sms.url,
              from: $scope.sms.from
            }
          sendMessage(message)
          .then(function(result){
            console.log('reslove')
            console.log(result)
          })
          .catch(function(error){

          })
        };

        //Phone widget
        $scope.startCall = function(){
          var message = {
            type:'call',
            from: $scope.call.from,
            url: $scope.call.url,
            to: $scope.call.to
          }
          sendMessage(message)
          .then(function(result){
            console.log(result)
          })
          .catch(function(error){

          })
        }

        /**
         * Send message 
         * @param  {JSON} message {type: xxxx, to: xxx, url: xxxx}
         * @return {Promise}        
         */
        function sendMessage(message) {
          if(bearerToken == ''){
           return checkToken(message);
          }
          var deferd = $q.defer()
          var dialog = {
            "method": "outboundCall",
            "params": {
              "adapterID": message.from.configId,
              "address": message.to,
              "url": message.url,
              "bearerToken": bearerToken
            }
          }

          Session.auth(bearerToken)

          AskFast.caller('startDialog', null, dialog)
            .then(function(response){
              if(response.error){
                deferd.reject(response)
              }else{
                deferd.resolve(response)
                $scope.request = {
                  host:'http:api.ask-fast.com/',
                  path:'startDialog/outbound',
                  header:{
                    Authrorization: 'Bearer '+bearerToken
                  },
                  payload:dialog
                }
              }
            })
            return deferd.promise;
        }

        function checkToken(message){
          if(bearerToken !=''){
            sendMessage(message)
          }else{
            getBearer().then(function(result){
              sendMessage(message);
            })
          }

        }

        function getBearer(){
          console.log('fetch bearerToken')
          var deferd = $q.defer()
          AskFast.caller('getAccessToken',null,{
            client_id: $scope.user.id,
            grant_type: 'refresh_token',
            refresh_token:$scope.user.refreshToken,
            client_secret:'none'
          }).then(function(result){
            if(!result.error){
              bearerToken = result.access_token
              deferd.resolve();
            }else{
              console.log('bear rejected')
              console.log(result)
              deferd.reject(result)
            }
          })
          return deferd.promise
        }


        $scope.toggleKeyReveal = function() {
          if ($scope.keyRevealTypeString == 'password') {
            $scope.keyRevealTypeString = 'text';
            $scope.keyButtonString = 'Hide';

            keyRevealTimeoutPromise = $timeout(function() {
              $scope.toggleKeyReveal();
            }, 5000)
          } else {
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
              //       Leave this comment until fixed.
          })
          .then(function(result) {
            $scope.logs = dashboardLogsFilter(result);
            $scope.loading.logs = false;
          });

        AskFast.caller('info')
          .then(function(info) {
            AskFast.caller('key')
              .then(function(keys) {
                info.refreshToken = keys.refreshToken;

                Store('app').save({
                  user: info
                });

                $rootScope.user = Store('app').get('user');
              });

          });

      }
    ]);
  }
);