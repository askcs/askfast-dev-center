define(
  ['controllers/controllers'],
  function (controllers)
  {
    'use strict';

    controllers.controller ('core',
      [
        '$rootScope', '$scope', 'AskFast', 'Store',
        function ($rootScope, $scope, AskFast, Store)
        {
          Store = Store('data');

          $scope.current = 'debugger';

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
            adapter: null
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
                  angular.forEach($scope.adapters, function (adapter)
                  {
                    if (adapter.configId == id) candidates.push(adapter);
                  });
                })
              }
            });

            $scope.candidates = candidates;
          };

          $scope.resetAdapterMenu = function ()
          {
            $scope.channel.type = null;
            $scope.channel.adapter = null;
          };

          $scope.query = {
            type: 'ALL',
            severity: 'ALL',
            ddr: false,
            limit: 100
          };

          $scope.Log = {
            data: null,

            list: function (period)
            {
              var _period = (period) ? period : Date.now();

              AskFast.caller('log', {
                limit:  $scope.query.limit,
                end:    parseInt(_period) + (1000 * 60 * 60 * 24)
              })
                .then((function (result)
                {
                  var logs = {
                    DDR:    [],
                    INFO:   [],
                    SEVERE: [],
                    WARNING:[]
                  };

                  angular.forEach(result, function (log)
                  {
                    angular.forEach($scope.adapters, function (adapter)
                    {
                      if (adapter.configId == log.adapterID)
                      {
                        log.myAddress   = adapter.myAddress;
                        log.adapterType = adapter.adapterType;
                      }
                    });

                    if (logs[log.level])
                      logs[log.level].push(log);
                  });

                  this.data = logs;

                  this.categorize();
                  this.severity();

                }).bind(this));
            },

            categorize: function ()
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
            },

            period: function ()
            {
              this.list(Date.parse($scope.query.until));
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
                    var ids = $scope.adapterTypes[adapter.adapterType].ids;

                    if (ids.indexOf(adapter.configId) == -1)
                      ids.push(adapter.configId);
                  });

                  Store.save($scope.adapterTypes, 'adapterTypes');

                  $scope.adapters = adapters;

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
//              AskFast.caller('updateAdapter', { level: $scope.channel.adapter },
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
                    $scope.dialog = null;

                    if ($scope.dialogs[0])
                      $scope.dialog = $scope.dialogs[0];

                    $scope.setSection('dialogs');
                  });
                }).bind(this));
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
                AskFast.caller('updateAdapter', { level: adapterId },{ dialogId: dialogId })
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
              $scope.dialog = dialog;

              if (this.adapters.list(dialog.id))
                $scope.dialogAdapters = this.adapters.list(dialog.id);
            }
          };

          function openDialog (dialog)
          {
            $scope.Dialog.open(dialog);
          }

          $scope.Dialog.list();

          setTimeout(function ()
          {
            if ($scope.dialogs)
            {
              $scope.$apply(function ()
              {
                if ($scope.dialogs.length > 0)
                  $scope.Dialog.open($scope.dialogs[0]);
              });
            }
          }, 250);
        }
      ]
    );
  }
);