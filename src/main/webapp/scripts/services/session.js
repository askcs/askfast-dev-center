(function() {
  define(['services/services'], function(services) {
    'use strict';
    services.factory('Session', [
      '$http', '$cookieStore', 'Store', function($http, $cookieStore, Store) {
        Store = Store('session');
        return {
          get: function() {
            var session;
            session = this.cookies.get();
            if (session) {
              this.set(session.id);
              return session;
            } else {
              return false;
            }
          },
          cookies: {
            age: 14,
            set: function(session) {
              var date, expires, value;
              date = new Date();
              date.setTime(date.getTime() + (this.age * 24 * 60 * 60 * 1000));
              expires = "; expires=" + date.toGMTString();
              value = session + expires + "; path=/";
              $cookieStore.put('X-SESSION_ID', value);
            },
            get: function() {
              var cookie;
              if (cookie = $cookieStore.get('X-SESSION_ID')) {
                return cookie.split(';')[0];
              }
            }
          },
          set: function(id, log) {
            var session;
            session = {
              id: id
            };
            if (log) {
              session.inited = new Date().getTime();
            }
            Store.save({
              info: session
            });
            this.cookies.set(session.id);
            $http.defaults.headers.common['X-SESSION_ID'] = session.id;
            return session;
          },
          clear: function() {
            $cookieStore.remove('X-SESSION_ID');
            $http.defaults.headers.common['X-SESSION_ID'] = null;
          }
        };
      }
    ]);
  });

}).call(this);
