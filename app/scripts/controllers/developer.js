define(
  ['controllers/controllers'],
  function (controllers)
  {
    'use strict';

    controllers.controller ('developer',
      [
        '$rootScope', '$scope', 'AskFast', 'Store',
        function ($rootScope, $scope, AskFast, Store)
        {
          Store = Store('data');

          $scope.current = 'extensions';

          $scope.setSection = function (selection)
          {
            $scope.current = selection;
          };

          $scope.types = [
            'Phone',
            'SMS',
            'Gtalk',
            'Email',
            'Twitter'
          ];

          $scope.adapterTypes = {
            broadsoft: {
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
            extension: null
          };

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
                  angular.forEach($scope.extensions, function (extension)
                  {
                    if (extension.configId == id) candidates.push(extension);
                  });
                })
              }
            });

            $scope.candidates = candidates;
          };

          $scope.resetAdapterMenus = function ()
          {
          };

          $scope.query = {
            type: 'ALL',
            severity: 'ALL',
            ddr: false,
            limit: 100
          };

          $scope.Log = {
            data: null,

            list: function ()
            {
              AskFast.caller('log', {
                limit: $scope.query.limit
              })
                .then((function (result)
                {
                  var logs = {
                    DDR:    [],
                    INFO:   [],
                    SEVERE: []
                  };

                  angular.forEach(result, function (log)
                  {
                    angular.forEach($scope.extensions, function (extension)
                    {
                      if (extension.configId == log.adapterID)
                      {
                        log.myAddress   = extension.myAddress;
                        log.adapterType = extension.adapterType;
                      }
                    });

                    logs[log.level].push(log);
                  });

                  this.data = logs;

                  this.type();
                  this.severity();

                }).bind(this));
            },

            type: function ()
            {
              var type;

              switch ($scope.query.type)
              {
                case 'GTALK':   type = 'xmpp';      break;
                case 'TWITTER': type = 'twitter';   break;
                case 'PHONE':   type = 'broadsoft'; break;
                case 'SMS':     type = 'sms';       break;
                case 'EMAIL':   type = 'email';     break;
              }

              var logs = [];

              angular.forEach(this.data, function (segment)
              {
                angular.forEach(segment, function (log)
                {
                  if (log.adapterType == type) logs.push(log);
                })
              });

              $scope.logs = logs;
            },

            severity : function ()
            {
              switch ($scope.query.severity)
              {
                case 'ALL':
                  var logs = [],
                      data = this.data;

                  if (!$scope.query.ddr) delete data['DDR'];

                  angular.forEach(data, function (segment)
                  {
                    angular.forEach(segment, function (log)
                    {
                      logs.push(log);
                    });
                  });

                  $scope.logs = logs;
                  break;

                default:
                  $scope.logs = this.data[$scope.query.severity];
              }
            }
          };

          $scope.$watch('query.ddr', function () { $scope.Log.list(); });

          $scope.Log.list();

          $scope.Adapter = {

            list: function (callback)
            {
              $scope.adapterType = '';

              AskFast.caller('getAdapters')
                .then(function (adapters)
                {
                  angular.forEach(adapters, function (adapter)
                  {
                    $scope.adapterTypes[adapter.adapterType].ids.push(adapter.configId);
                  });

                  Store.save($scope.adapterTypes, 'adapterTypes');

                  $scope.extensions = adapters;

                  if (callback) callback.call(null, adapters);
                });
            },

            add: function (adapter)
            {
              AskFast.caller('createAdapter', {
                level: adapter.configId
              }).then((function ()
              {
                this.list();
              }).bind(this));
            },

            // TODO: Add changing dialog info later on
//            update: function (dialog)
//            {
//              AskFast.caller('updateAdapter', { level: $scope.channel.extension },
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
                level: adapter.configId
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

                  if (callback) callback.call();
                });
            },

            add: function (dialog)
            {
              AskFast.caller('createDialog', null, {
                name: dialog.form.name,
                url: dialog.form.url
              })
                .then((function ()
                {
                  $scope.addingDialog = false;

                  this.list(function ()
                  {
                    $scope.setSection('dialogs');
                  });
                }).bind(this));
            },

            remove: function (dialog)
            {
              AskFast.caller('deleteDialog', {
                node: dialog.id
              })
                .then((function ()
                {
                  $scope.addingDialog = false;

                  this.list(function ()
                  {
                    $scope.setSection('dialogs');
                  });
                }).bind(this));
            },

            adapters: {
              list: function (dialogId, updated)
              {
                var adapters = [];

                angular.forEach($scope.extensions, function (adapter)
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
                AskFast.caller('updateAdapter', { level: adapterId },
                  {
                    dialogId: dialogId
                  }).then((function (adapter)
                  {
                    // $scope.dialogAdapters = this.list(dialogId, adapter);

                    $scope.Adapter.list();
                  }).bind(this));
              },

              add: function (dialog)
              {
                this.update(dialog.id, $scope.channel.extension);

                // $scope.Dialog.open($scope.dialogs[0]);
              },

              remove: function (extension)
              {
                this.update('', extension.configId);
              }
            },

            open: function (dialog)
            {
              $scope.dialog = dialog;

              $scope.dialogAdapters = this.adapters.list(dialog.id);
            }
          };

          $scope.Dialog.list();

          setTimeout(function ()
          {
            if ($scope.dialogs)
            {
              $scope.$apply(function ()
              {
                $scope.Dialog.open($scope.dialogs[0]);
              });
            }
          }, 250);
        }
      ]
    );
  }
);