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
            // console.log('channel type has been changed!');
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


        }
      ]
    );
  }
);