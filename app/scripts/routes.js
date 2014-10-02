define(
  ['app'],
  function (app)
  {
    'use strict';

    app.config(
      [
        '$routeProvider', '$httpProvider',
        function ($routeProvider, $httpProvider)
        {
          var redirect = [
            '$location', 'Store',
            function ($location, Store)
            {
              if (Store('session').get('info').id == 'info') $location.path('#/login');
            }
          ];

          $routeProvider
            .when('/register',
            {
              templateUrl:    'views/register.html',
              controller:     'user',
              reloadOnSearch: false
            })
            .when('/login',
            {
              templateUrl:    'views/login.html',
              controller:     'user'
            })
            .when('/logout',
            {
              templateUrl:    'views/logout.html',
              controller:     'user'
            })
            .when('/dashboard',
            {
              templateUrl:    'views/dashboard.html',
              controller:     'dashboard',
              resolve:        { redirect: redirect }
            })
            .when('/developer',
            {
              templateUrl:    'views/developer.html',
              controller:     'core',
              resolve:        { redirect: redirect }
            })
            .when('/profile',
            {
              templateUrl:    'views/profile.html',
              controller:     'profile',
              resolve:        { redirect: redirect }
            })
            .otherwise({
              redirectTo: '/login'
            });

          $httpProvider.interceptors.push('Interceptor');
        }
      ]
    );
  }
);