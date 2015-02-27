(function() {
  define(['services/services'], function(services) {
    'use strict';
    services.factory('Session', [
      '$http', 'Store', function($http, Store) {
        Store = Store('session');
        return {
          get: function() {
            var session;
            session = Store.get('info');
            return session.id;
          },
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
          auth: function(bearer) {
            return $http.defaults.headers.common['Authorization'] = bearer;
          },
          clear: function() {
            Store.remove('info');
            $http.defaults.headers.common['X-SESSION_ID'] = null;
          }
        };
      }
    ]);
  });

}).call(this);
