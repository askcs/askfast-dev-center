define(['services/services'], function(services) {
  'use strict';
  
  services.factory('Offline', [
    '$rootScope',
    function($rootScope) {
      var Offline;
      
      return Offline = (function() {
        function Offline() {
          var event, _i, _len, _ref;
          this.events = ['online', 'offline'];
          _ref = this.events;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            event = _ref[_i];
            this.addEvents(event);
          }
        }
        // Add events
        Offline.prototype.addEvent = function(element, event, fn, useCapture) {
          if (useCapture == null) {
            useCapture = false;
          }
          return element.addEventListener(event, fn, useCapture);
        };
        
        // Run event list
        Offline.prototype.addEvents = function(event) {
          return this.addEvent(window, event, this[event]);
        };
        
        // Are we online?
        Offline.prototype.online = function() {
          return $rootScope.$broadcast('connection', false);
        };
        
        // Or offline?
        Offline.prototype.offline = function() {
          return $rootScope.$broadcast('connection', true);
        };
        
        return Offline;
      })();
    }
  ]);
});