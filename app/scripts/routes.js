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
            .when('/home',
            {
              templateUrl:    'views/home.html',
              controller:     'home'
            })
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
            .otherwise({
              redirectTo: '/home'
            });

          $httpProvider.interceptors.push('Interceptor');
        }
      ]
    );
  }
);