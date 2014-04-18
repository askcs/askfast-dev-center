(function() {
  define(['services/services'], function(services) {
    'use strict';
    services.factory('Interceptor', [
      '$q', 'Log', function($q, Log) {
        return {
          request: function(config) {
            return config || $q.when(config);
          },
          requestError: function(rejection) {
            return $q.reject(rejection);
          },
          response: function(response) {
            return response || $q.when(response);
          },
          responseError: function(rejection) {
            return $q.reject(rejection);
          }
        };
      }
    ]);
  });

}).call(this);
