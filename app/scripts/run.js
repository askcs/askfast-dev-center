define(
  ['app', 'localization', 'config'],
  function (app, locals, config)
  {
    'use strict';

    app.run(
      [
        '$rootScope', '$location',
        function($rootScope, $location)
        {
          $rootScope.app = $rootScope.app || {};

          $rootScope.setLanguage = function (language)
          {
            $rootScope.app.language = language;
            $rootScope.ui = locals.ui[language];
          };

          $rootScope.setLanguage(config.app.defaults.language);

          $rootScope.config = config.app;

          $rootScope.setMainView = function (view)
          {
            if ($rootScope.config.app.nav.subs[view])
            {
              $location.path(view).hash($rootScope.config.app.nav.subs[view][0]);

              $rootScope.setSubView($rootScope.config.app.nav.subs[view][0]);
            }
            else
            {
              $location.path(view);
            }

            $rootScope.collapseMenu();
          };

          $rootScope.collapseMenu = function ()
          {
            if ($('.navbar .in').length > 0)
            {
              $('.navbar .navbar-collapse').removeClass('in').addClass('collapse');
            }
          };

          var parts = [];

          angular.forEach($rootScope.config.app.nav.subs, function (sub)
          {
            angular.forEach(sub, function (part)
            {
              parts.push(part);
            });
          });

          $rootScope.subView = {};

          $rootScope.setSubView = function (view)
          {
            angular.forEach(parts, function (part)
            {
              $rootScope.subView[part] = false;
            });

            $location.hash(view);

            $rootScope.subView[view] = true;
          };

          $rootScope.redirectTo = function (main, sub)
          {
            $location.path(main).hash(sub);

            $rootScope.setSubView(sub);

            window.scrollTo(0, 0);

            $rootScope.contact.subject.sales = true;
          };

          $location.hash() && $rootScope.setSubView($location.hash());

          $rootScope.location = {};

          $rootScope.home = {
            reference: {}
          };

          var i     = 0,
              total = $rootScope.ui.pages.home.references.length;

          $rootScope.home.reference = $rootScope.ui.pages.home.references[i];

          setInterval(function ()
          {
            i = (i === total - 1) ? 0 : i + 1;

            $rootScope.home.reference = $rootScope.ui.pages.home.references[i];

            $rootScope.$apply();
          }, 10 * 1000);

          $rootScope.isInternPage = function ()
          {
            var interns = ['/login', '/register'];

            return (interns.indexOf($location.path()) >= 0);
          };

          $rootScope.$on('$routeChangeStart', function ()
          {
            $rootScope.location.path = $location.path().substring(1);
          });

          $rootScope.$on('$routeChangeSuccess', function () {});

          $rootScope.$on('$routeChangeError', function () {});
        }
      ]
    );
  }
);