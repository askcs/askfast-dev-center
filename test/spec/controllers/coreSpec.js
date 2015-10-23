define(
  [
    'angular-mocks',
    'app',
    'controllers/core',
    'services/moment'
  ],
  function(ngMock, app){
    'use strict';

    // Bind polyfill for PhantomJS
    // TODO: Load polyfill by default
    beforeAll(function(){
      var isFunction = function(o) {
        return typeof o == 'function';
      };

      var bind,
        slice = [].slice,
        proto = Function.prototype,
        featureMap;

      featureMap = {
        'function-bind': 'bind'
      };

      function has(feature) {
        var prop = featureMap[feature];
        return isFunction(proto[prop]);
      }

      // check for missing features
      if (!has('function-bind')) {
        // adapted from Mozilla Developer Network example at
        // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind
        bind = function bind(obj) {
          var args = slice.call(arguments, 1),
            self = this,
            nop = function() {
            },
            bound = function() {
              return self.apply(this instanceof nop ? this : (obj || {}), args.concat(slice.call(arguments)));
            };
          nop.prototype = this.prototype || {}; // Firefox cries sometimes if prototype is undefined
          bound.prototype = new nop();
          return bound;
        };
        proto.bind = bind;
      }
    });

    beforeEach(module('AskFast'));

    beforeEach(function(){
      var mockAskFast = {
        caller: function(){
          return {then: function(){return "nothing";}};
        }
      };
      var mockStore = function(thing){
        return {
          get: function(){},
        };
      };

      var mockRoute = {
        current: {
          params: {

          }
        }
      };

      module('controllers', function($provide) {
        $provide.value('AskFast', mockAskFast);
        $provide.value('Store', mockStore);
        $provide.value('$route', mockRoute);
      })
    });

    describe('The core controller:', function(){

      var coreCtrl, scope;

      beforeEach(inject(function($controller, $rootScope){
        scope = $rootScope.$new();
        coreCtrl = $controller('core', {
          $scope: scope
        });
      }));

      it('should contain $scope.loading', function(){
        expect(typeof scope.loading).not.toBe('undefined');
      });

    });

  })
