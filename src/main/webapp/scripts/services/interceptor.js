(function() {
  define(['services/services'], function(services) {
    'use strict';
    services.factory('Interceptor', [
      '$q', '$location', 'Log', function($q, $location, Log) {
        return {
          request: function(config) {
            return config || $q.when(config);
          },
          requestError: function(rejection) {
            console.warn('request error ->', rejection);
            return $q.reject(rejection);
          },
          response: function(response) {
            return response || $q.when(response);
          },
          responseError: function(rejection) {
            if (rejection.status === 403) {
              $location.path('#/login');
            }
            return $q.reject(rejection);
          }
        };
      }
    ]);
  });

}).call(this);
