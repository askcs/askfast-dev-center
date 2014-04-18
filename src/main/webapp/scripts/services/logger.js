(function() {
  define(['services/services'], function(services) {
    'use strict';
    services.factory('Log', [
      'Store', function(Store) {
        return {
          error: function(trace) {
            var body, err, stamp;
            Store = Store('error');
            stamp = Date.now();
            err = {};
            body = {};
            if (trace.hasOwnProperty('message')) {
              body = {
                stack: trace.stack,
                message: trace.message
              };
            } else {
              body = {
                trace: trace
              };
            }
            err[stamp] = body;
            console.warn('Error: ', trace);
            return Store.save(err);
          }
        };
      }
    ]);
  });

}).call(this);
