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
              controller:     'core'
            })
            .when('/developer',
            {
              templateUrl:    'views/developer.html',
              controller:     'core'
            })
            .when('/profile',
            {
              templateUrl:    'views/profile.html',
              controller:     'core'
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