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

          $scope.current = 'dialogs';

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
                    if (extension.configId == id)
                      candidates.push(extension);
                  });
                })
              }
            });

            $scope.candidates = candidates;
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
                  if (log.adapterType == type)
                  {
                    logs.push(log);
                  }
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
                  // Store.save(adapters, 'adapters');

                  // console.log('adapters ->', adapters);

                  angular.forEach(adapters, function (adapter)
                  {
                    $scope.adapterTypes[adapter.adapterType].ids.push(adapter.configId);
                  });

                  Store.save($scope.adapterTypes, 'adapterTypes');

                  $scope.extensions = adapters;

                  if (callback) callback.call();
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

            open: function (dialog)
            {
              $scope.dialog = dialog;
            }

          };

          $scope.Dialog.list();

          setTimeout(function ()
          {
            $scope.$apply(function ()
            {
              $scope.Dialog.open($scope.dialogs[0]);
            });
          }, 250);
        }
      ]
    );
  }
);