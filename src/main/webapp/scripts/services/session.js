define(['services/services'], function(services) {
  'use strict';
  
  services.factory('Session', [
    '$http', 'Store',
    function($http, Store) {
      Store = Store('session');

      return {
        // Check the session
        get: function() {
          var session;
          session = Store.get('info');
          return session.id;
        },
        // Set the session
        set: function(id) {
          var session;
          session = {
            id: id
          };
          session.inited = new Date().getTime();
          Store.save({
            info: session
          });
          $http.defaults.headers.common['X-SESSION_ID'] = session.id;
          return session;
        },
        //set auth header
        auth: function(bearer) {
          return $http.defaults.headers.common['Authorization'] = bearer;
        },
        //set content type
        setHeader: function(type) {
          return $http.defaults.headers.post['Content-Type'] = type;
        },
        // Clear the session
        clear: function() {
          Store.remove('info');
          $http.defaults.headers.common['X-SESSION_ID'] = null;
        }
      };
    }
  ]);
});