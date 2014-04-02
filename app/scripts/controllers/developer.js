define(
  ['controllers/controllers'],
  function (controllers)
  {
    'use strict';

    controllers.controller ('developer',
      [
        '$rootScope', '$scope', 'AskFast',
        function ($rootScope, $scope, AskFast)
        {
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

          $scope.extensions = [
            { id: 0, type: 0, value: '+31 10 123456789' },
            { id: 1, type: 3, value: 'culusoy@ask-cs.com' },
            { id: 2, type: 4, value: '@ask-fast' },
            { id: 3, type: 0, value: '+31 85 2225456' },
            { id: 4, type: 3, value: 'info@ask-fast.com' }
          ];

          $scope.channel = {
            type: null,
            extension: null
          };

          $scope.candidates = [];

          $scope.channelTypeSelected = function ()
          {
            var candidates = [];

            angular.forEach($scope.extensions, function (extension)
            {
              if ($scope.channel.type == extension.type)
                candidates.push({
                  id:   extension.id,
                  value:extension.value
                });
            });

            $scope.candidates = candidates;
          };



          AskFast.caller('getAdapters')
            .then(function (adapters)
            {
              console.log('free adapters ->', adapters);
            });



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

        }
      ]
    );
  }
);