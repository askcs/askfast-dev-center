/// <reference path="../typings/angularjs/angular.d.ts"/>
/// <reference path="../typings/bootstrap/bootstrap.d.ts"/>
import controllers = require('controllers/controllers')

'use strict';

export = controllers.controller('core',
      [
        '$rootScope', '$scope', '$q','$route', '$location','$timeout','AskFast', 'Store', 'moment',
        function ($rootScope, $scope, $q, $route, $location, $timeout, AskFast, Store, moment)
        {
          Store = Store('data');

          $scope.ddrId = null;
          $scope.currentSection = 'debugger';

          if ($route.current.params.ddrId) {
            $scope.currentSection = 'details';
            $scope.ddrId = $route.current.params.ddrId;
          }

          $scope.loading = {
            logs: true
          };

          $scope.setSection = function (selection, clearDdrId)
          {
            if ($route.current.params.ddrId){
              $scope.ddrId = null;
              $location.url('/developer');
            }

            if(clearDdrId){
              $scope.ddrId = null;
            }

            $scope.currentSection = selection;

            if(selection === 'debugger'){
              $scope.logs = [];
              $scope.Log.list();
            }
          };

          $scope.$on('$routeUpdate', function(){
            if ($route.current.params.ddrId && $scope.ddrId === null){
              $scope.ddrId = $route.current.params.ddrId;
              $scope.currentSection = 'details';
              $scope.Log.detail($scope.ddrId);
            }
            else if($scope.currentSection === 'details'){
              // means the user went back
              // the only links to 'details' are from 'debugger'
              $scope.setSection('debugger', true);
            }
          });

          $scope.types = [
            'Phone',
            'SMS',
            'Gtalk',
            'Email',
            'Twitter'
          ];

          $scope.adapterTypes = {
            call: {
              label: 'Phone',
              ids: []
            },
            xmpp: {
              label: 'Gtalk',
              ids: []
            },
            email: {
              label: 'Email',
              ids: []
            },
            twitter: {
              label: 'Twitter',
              ids: []
            },
            sms: {
              label: 'SMS',
              ids: []
            }
          };

          $scope.channel = {
            type: null,
            adapter: null
          };

          $scope.forms = {};

          $scope.candidates = [];

          $scope.channelTypeSelected = function ()
          {
            var candidates = [];

            angular.forEach($scope.adapterTypes, function (type)
            {
              if (type.label == $scope.channel.type)
              {
                angular.forEach(type.ids, function (id)
                {
                  angular.forEach($scope.adapters, function (adapter)
                  {
                    if (adapter.configId == id) candidates.push(adapter);
                  });
                })
              }
            });

            $scope.candidates = candidates;
          };

          $scope.dialogAuth = {
            open: false,
            message: '',
            messageType: ''
          };

          $scope.resetAdapterMenu = function ()
          {
            $scope.channel.type = null;
            $scope.channel.adapter = null;
          };

          $scope.query = {
            category: 'all',
            limit: 100,
            until: moment().format('DD/MM/YYYY')
          };

          function processDdr(ddrLog, ddrTypes, adapterMap){
            if(ddrLog.start){
              ddrLog.startString = moment(ddrLog.start).format('HH:mm:ss Z YYYY-MM-DD');
              if(ddrLog.duration !== null){
                ddrLog.endString = moment(ddrLog.start + ddrLog.duration).format('HH:mm:ss Z YYYY-MM-DD');
              }
              else{
                ddrLog.endString = '-';
              }
            }
            else{
              ddrLog.startString = '-';
              ddrLog.endString = '-';
            }
            ddrLog.fromAddress = ddrLog.fromAddress || '-';
            ddrLog.toAddress = ddrLog.toAddressString ? Object.keys(angular.fromJson(ddrLog.toAddressString))[0] : '-';
            ddrLog.ddrTypeString = ddrLog.ddrTypeId ? ddrTypes[ddrLog.ddrTypeId].categoryString : '-';
            // there's no way to get the index from ng-repeat, make an object out of it
            if(ddrLog.statusPerAddress){
              angular.forEach(ddrLog.statusPerAddress, function(item, index){
                ddrLog.statusPerAddress[index] =  {index: index, status: item};
              });
            }
            ddrLog.adapterTypeString = ddrLog.adapterId ?  $scope.adapterTypes[adapterMap[ddrLog.adapterId]].label : '-';

            return ddrLog;
          }

          $scope.Log = {
            data: null,

            list: function (period)
            {
              var _period = (period) ? period : moment().endOf('day').valueOf();

              $scope.loading.logs = true;

              AskFast.caller('ddr', {
                limit:  $scope.query.limit,
                endTime:    _period
              })
                .then((function (ddr)
                {
                  var ddrTypes = Store.get('ddrTypes');

                  var adapterMap = Store.get('adapterMap');

                  var logs = {
                    call: [],
                    email: [],
                    sms: [],
                    xmpp: [],
                    twitter: []
                  };

                  var allLogs = [];

                  angular.forEach(ddr, function(ddrLog){
                    allLogs.push(processDdr(ddrLog, ddrTypes, adapterMap));
                  });

                  angular.forEach(allLogs, function (ddrLog)
                  {
                    angular.forEach(adapterMap, function (adapterType, adapterId)
                    {

                      if (ddrLog.adapterId == adapterId){
                        if (logs[adapterMap[ddrLog.adapterId]]){
                          logs[adapterMap[ddrLog.adapterId]].push(ddrLog);
                        }
                      }

                    });
                  });

                  this.data = logs;

                  this.categorize();
                  $scope.loading.logs = false;

                }).bind(this));
            },

            categorize: function ()
            {
              var category = $scope.query.category;

              if(category && category !== 'all'){
                $scope.logs = this.data[category];
              }
              else{
                // $scope.query.category is ALL
                var logs = [],
                  data = this.data;

                angular.forEach(data, function (segment)
                {
                  angular.forEach(segment, function (log)
                  {
                    logs.push(log);
                  });
                });

                $scope.logs = logs;
              }

            },

            period: function ()
            {
              this.list(moment($scope.query.until, 'DD/MM/YYYY').endOf('day').valueOf());
            },
            detail: function(ddrId)
            {
              var ddrTypes = Store.get('ddrTypes');
              var adapterMap = Store.get('adapterMap');

              $q.all([AskFast.caller('ddrRecord', {
                second: ddrId
              }),
              AskFast.caller('log', {
                ddrRecordId: ddrId
              })])
              .then(function(resultArray){

                $scope.ddrDetails = processDdr(resultArray[0], ddrTypes, adapterMap);

                var logs = resultArray[1];

                angular.forEach(logs, function(item){
                  if (item.timestamp){
                    item.timeString = moment(item.timestamp).format('HH:mm:ss Z YYYY-MM-DD')
                  }
                });

                $scope.logs = logs;

                $timeout(function(){
                  // makes sure that first call to collapse doesn't toggle.
                  // if not done, collapseAll will expand untouched panels
                  $('.ddr-detail .panel-collapse').collapse({toggle:false});
                });
              }, function(result){
                console.warn('error ',result);
              });

            }
          };

          if(!$scope.ddrId){
            $scope.Log.list();
          }
          else{
            $scope.Log.detail($scope.ddrId);
          }

          $scope.Adapter = {

            list: function (callback)
            {
              $scope.adapterType = '';

              AskFast.caller('getAdapters')
                .then(function (adapters)
                {

                  angular.forEach(adapters, function (adapter) {
                    if (adapter.adapterType in $scope.adapterTypes) {
                      var ids = $scope.adapterTypes[adapter.adapterType].ids;
                      if (ids.indexOf(adapter.configId) == -1)
                        ids.push(adapter.configId);
                    }
                  });
                  Store.save($scope.adapterTypes, 'adapterTypes');

                  $scope.adapters = adapters;

                  if (callback) callback.call(null, adapters);
                });
            },

            add: function (adapter)
            {
              AskFast.caller('createAdapter', {
                second: adapter.configId
              }).then((function ()
              {
                this.list();

                // reset adapter add form
                $scope.adapterType= '';
              }).bind(this));
            },

            // TODO: Add changing dialog info later on
//            update: function (dialog)
//            {
//              AskFast.caller('updateAdapter', { second: $scope.channel.adapter },
//                {
//                  dialogId: dialog.id
//                }).then((function ()
//              {
//                this.list();
//
//                $scope.Adapter.adapters();
//              }).bind(this));
//            },

            query: function (type)
            {
              AskFast.caller('freeAdapters', {
                adapterType: type
              })
                .then(function (result)
                {
                  $scope.freeAdapters = result;
                }
              );
            },

            remove: function (adapter)
            {
              AskFast.caller('removeAdapter', {
                second: adapter.configId
              }).then((function ()
              {
                this.list();
              }).bind(this));
            }
          };

          $scope.Adapter.list();

          $scope.Dialog = {

            list: function (callback)
            {
              AskFast.caller('getDialog')
                .then(function (dialogs)
                {
                  $scope.dialogs = dialogs;
                  $scope.loadingDialogs = true
                  if (callback) callback.call();
                });
            },

            add: function (dialog)
            {
              if(dialog.form.name && dialog.form.url){
                AskFast.caller('createDialog', null, {
                  name: dialog.form.name,
                  url: dialog.form.url
                })
                  .then((function (result)
                  {
                    $scope.addingDialog = false;

                    this.list(function ()
                    {
                      $scope.setSection('dialogs');
                      openDialog(result);
                      // close auth menu if it was open
                      $scope.dialogAuth = false;
                    });
                  }).bind(this));
              }
            },

            remove: function (dialog)
            {
              AskFast.caller('deleteDialog', {
                third: dialog.id
              })
                .then((function ()
                {
                  $scope.addingDialog = false;

                  this.list(function ()
                  {
                    $scope.dialog = null;

                    if ($scope.dialogs[0])
                      $scope.dialog = $scope.dialogs[0];

                    $scope.setSection('dialogs');
                  });
                }).bind(this));
            },

            update: function (dialog, deferred)
            {
              var dialogObject:any = {
                id: dialog.id,
                name: dialog.name,
                url: dialog.url,
                owner: dialog.owner
              };

              if(angular.isDefined(dialog.userName) &&
                 angular.isDefined(dialog.password) &&
                 angular.isDefined(dialog.useBasicAuth)){
                dialogObject.userName = dialog.userName;
                dialogObject.password = dialog.password;
                dialogObject.useBasicAuth = dialog.useBasicAuth;
              }

              AskFast.caller('updateDialog', {
                third: dialog.id
              },dialogObject)
              .then((function (result)
              {

                if(deferred){
                  if (result.error){
                    deferred.reject(result);
                  }
                  else {
                    deferred.resolve(result);
                  }
                }

                this.list();

              }).bind(this));
            },

            updateDetails: function (dialog)
            {
               var dialogArr = $scope.dialogs.filter(function(_dialog){
                if(_dialog.id === dialog.id){
                  return true;
                } else { return false; }
              })

              //we're not updating other properties, reset
              dialog.userName = dialogArr[0].userName;
              dialog.password = dialogArr[0].password;

              this.update(dialog);
            },

            adapters: {
              list: function (dialogId, updated)
              {
                var adapters = [];

                angular.forEach($scope.adapters, function (adapter)
                {
                  if (updated && updated.id == adapter.id)
                  {
                    adapters.push(updated);
                  }
                  else
                  {
                    if (adapter.dialogId == dialogId) adapters.push(adapter);
                  }
                });

                return adapters;
              },

              update: function (dialogId, adapterId)
              {
                AskFast.caller('updateAdapter', { second: adapterId },{ dialogId: dialogId })
                  .then((function (adapter)
                  {
                    // $scope.dialogAdapters = this.list(dialogId, adapter);

                    $scope.Adapter.list();
                  }).bind(this));
              },

              add: function (dialog)
              {
                this.update(dialog.id, $scope.channel.adapter);

                $scope.resetAdapterMenu();

                $scope.candidates = [];

                openDialog(dialog);
              },

              remove: function (adapter)
              {
                this.update('', adapter.configId);
              }
            },

            open: function (dialog)
            {
              $scope.dialog = angular.copy(dialog);

              // cancel auth notification if any
              $scope.Dialog.authentication.notify(null, null, true);

              // will be undefined on first load
              if(angular.isDefined($scope.forms.details)){
                $scope.forms.details.$setPristine();
                if (this.adapters.list(dialog.id))
                  $scope.dialogAdapters = this.adapters.list(dialog.id);
              }
            },
            authentication:{
              enable: function(dialog)
              {
                //check with falsiness, could be null, undefined or empty string
                if(!!dialog.userName && !!dialog.password){
                  dialog.useBasicAuth = true;
                }
                else {
                  this.notify('Please fill in both a Username and a Password', 'warning');
                  return;
                }

                var dialogArr = $scope.dialogs.filter(function(_dialog){
                  if(_dialog.id === dialog.id){
                    return true;
                  } else { return false; }
                })

                //we're not updating other properties, reset
                dialog.name = dialogArr[0].name;
                dialog.url = dialogArr[0].url;

                var deferred = $q.defer();
                $scope.Dialog.update(dialog, deferred);

                deferred.promise
                .then(function(result){
                  //success
                  $scope.dialogAuth.open = false;
                  this.notify('Basic Authentication applied successfully', 'success');
                }.bind(this))
                .catch(function(result){
                  //something went wrong, handle it
                  console.log('error -> ', result);
                  this.notify('Something went wrong with the request', 'danger');
                }.bind(this));
              },
              disable: function(dialog)
              {
                var dialogObj;

                dialog.useBasicAuth = false;

                var dialogArr = $scope.dialogs.filter(function(_dialog){
                  if(_dialog.id === dialog.id){
                    return true;
                  } else { return false; }
                })

                 //we're not updating other properties, reset
                dialog.name = dialogArr[0].name;
                dialog.url = dialogArr[0].url;

                dialogObj = angular.copy(dialog);

                dialogObj.userName = null;
                dialogObj.password = null;

                var deferred = $q.defer();
                $scope.Dialog.update(dialogObj, deferred);

                deferred.promise
                .then(function(result){
                  //success
                  $scope.dialogAuth.open = false;
                  this.notify('Basic Authentication successfully disabled', 'success');
                }.bind($scope.Dialog.authentication))
                .catch(function(result){
                  //something went wrong, handle it
                  console.log('error -> ', result);
                  this.notify('Something went wrong with the request', 'danger');
                }.bind($scope.Dialog.authentication));
              },
              notify: function(message, type, cancel)
              {
                if(cancel){
                  $scope.dialogAuth.message = '';
                }

                $scope.dialogAuth.message = message;
                $scope.dialogAuth.messageType = type;

                if($scope.authNotifyTimeoutPromise){
                  $timeout.cancel($scope.authNotifyTimeoutPromise);
                }

                $scope.authNotifyTimeoutPromise = $timeout(function(){
                    $scope.dialogAuth.message = '';
                }, 6000);
              },
              cancel: function(dialog)
              {
                var dialogArr = $scope.dialogs.filter(function(_dialog){
                  if(_dialog.id === dialog.id){
                    return true;
                  } else { return false; }
                });
                // Only reset userName and password
                $scope.dialog.userName = dialogArr[0].userName;
                $scope.dialog.password = dialogArr[0].password;

                $scope.dialogAuth.open = false;
                $scope.forms.auth.$setPristine();
              }
            }
          };

          function openDialog (dialog)
          {
            $scope.Dialog.open(dialog);
          }

          $scope.authenticateDialog = function(dialog){
            $scope.Dialog.authentication.enable(dialog);
          }
          $scope.disableDialogAuthentication = function(dialog){
           $scope.Dialog.authentication.disable(dialog);
          }
          $scope.cancelAuthentication = function(dialog){
            $scope.Dialog.authentication.cancel(dialog);
          }

          $scope.expandAll = function(){
            $('.ddr-detail .panel-collapse').collapse('show');
          };

          $scope.collapseAll = function(){
            $('.ddr-detail .panel-collapse').collapse('hide');
          };

          // grab the list, then select the first if exists
          $scope.Dialog.list(function(){
            if ($scope.dialogs.length > 0)
                  $scope.Dialog.open($scope.dialogs[0]);
          });
        }
      ]
    );
