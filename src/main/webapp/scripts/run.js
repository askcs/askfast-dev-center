define(
  ['app', 'localization', 'config'],
  function (app, locals, config)
  {
    'use strict';

    app.run(
      [
        '$rootScope', '$location', 'Offline', 'Session', 'Store', '$http',
        function($rootScope, $location, Offline, Session, Store, $http)
        {
          new Offline();

          $rootScope.$on('connection', function ()
          {
            console.log((!arguments[1]) ? 'connection restored' : 'connection lost :[');
          });

          $rootScope.app  = $rootScope.app  || {};
          $rootScope.user = $rootScope.user || Store('app').get('user');

          $rootScope.setLanguage = function (language)
          {
            $rootScope.app.language = language;
            $rootScope.ui = locals.ui[language];
          };

          $rootScope.setLanguage(config.app.defaults.language);

          $rootScope.config = config.app;

          if (!$http.defaults.headers.common['X-SESSION_ID'])
            $http.defaults.headers.common['X-SESSION_ID'] = Session.get();

          /**
           * TODO: Take it to a directive
           */
          $rootScope.$on('$routeChangeStart', function () {});

          $rootScope.$on('$routeChangeSuccess', function () {});

          $rootScope.$on('$routeChangeError', function () {});
        }
      ]
    );
  }
);