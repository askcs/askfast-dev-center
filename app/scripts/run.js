define(
  ['app', 'localization', 'config'],
  function (app, locals, config)
  {
    'use strict';

    app.run(
      [
        '$rootScope', '$location', 'Offline',
        function($rootScope, $location, Offline)
        {
          new Offline();

          $rootScope.$on('connection', function ()
          {
            if (!arguments[1])
            {
              console.log('connection restored');
            }
            else
            {
              console.log('connection lost :[');
            }
          });

          $rootScope.app = $rootScope.app || {};

          $rootScope.setLanguage = function (language)
          {
            $rootScope.app.language = language;
            $rootScope.ui = locals.ui[language];
          };

          $rootScope.setLanguage(config.app.defaults.language);

          $rootScope.config = config.app;

          // TODO: Take it to a directive
          $rootScope.$on('$routeChangeStart', function () {});

          $rootScope.$on('$routeChangeSuccess', function () {});

          $rootScope.$on('$routeChangeError', function () {});
        }
      ]
    );
  }
);