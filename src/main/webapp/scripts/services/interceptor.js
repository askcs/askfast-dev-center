define(['services/services'], function(services) {
  'use strict';
  
  services.factory('Interceptor', [
    '$q',
    '$location',
    'Log',
    function($q, $location, Log) {
      
      return {
        // Log request
        request: function(config) {
          return config || $q.when(config);
        },
        
        // On request error
        requestError: function(rejection) {
          console.warn('request error ->', rejection);
          return $q.reject(rejection);
        },
        
        // Log response
        response: function(response) {
          return response || $q.when(response);
        },
        
        // On response error
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