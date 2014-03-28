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
              controller:     'register',
              reloadOnSearch: false
            })
            .when('/login',
            {
              templateUrl:    'views/login.html',
              controller:     'login'
            })
            .when('/logout',
            {
              templateUrl:    'views/logout.html',
              controller:     'logout'
            })
            .when('/dashboard',
            {
              templateUrl:    'views/dashboard.html',
              controller:     'dashboard'
            })
            .when('/developer',
            {
              templateUrl:    'views/developer.html',
              controller:     'developer'
            })
            .when('/help',
            {
              templateUrl:    'views/help.html',
              controller:     'help'
            })
            .when('/profile',
            {
              templateUrl:    'views/profile.html',
              controller:     'profile'
            })
            .otherwise({
              redirectTo: '/dashboard'
            });

          $httpProvider.interceptors.push('Interceptor');
        }
      ]
    );
  }
);