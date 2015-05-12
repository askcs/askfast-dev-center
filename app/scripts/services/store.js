define(['services/services'], function(services) {
  'use strict';
  
  // TODOS
  // 1. Return callbacks in CRUD actions
  // 2. Extend it with local searching capabilitites
  // 3. Implement Log module for errors

  services.factory('Store', [
    '$window',
    '$log',
    '$parse',
    function($window, $log, $parse) {
      
      return function(name, config) {
        var LawnChair, Store, allAsArray, allAsCollection, array, collection, getDefault, getEntryId, idGetter, isArray, removeEntry, saveEntry, transformLoad, transformSave, updateArray, updateCache, updateCacheFromStorage;
        
        // Get entry by ID
        getEntryId = function(entry) {
          try {
            return idGetter(entry);
          } catch (e) {
            return null;
          }
        };
        // Create our LawnChair object
        LawnChair = function(callback) {
          return new Lawnchair({
            name: name
          }, callback);
        };
        // Save entry
        saveEntry = function(data, key) {
          var update;
          key = key.toString();
          if (angular.isObject(data) && data !== collection[key]) {
            collection[key] = collection[key] || {};
            angular.extend(collection[key], data);
          } else {
            collection[key] = data;
          }
          update = {
            key: key,
            value: transformSave(collection[key])
          };
          try {
            LawnChair(function() {
              this.save(update);
            });
          } catch (e) {
            if (e.name === 'QUOTA_EXCEEDED_ERR' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
              $window.localStorage.clear();
            }
            $log.info('LocalStorage Exception ==> ' + e.message);
          }
        };
        // Update array
        updateArray = function(data) {
          array.length = 0;
          _.each(data, function(o) {
            array.push(o);
          });
          return array;
        };
        // Update cache
        updateCache = function(obj, key) {
          if (obj && angular.isObject(obj) && collection[key] && collection[key] !== obj) {
            angular.extend(collection[key], obj);
          } else {
            collection[key] = obj;
          }
        };
        // Update cahe from storage
        updateCacheFromStorage = function(cache, storage) {
          if (storage) {
            if (angular.isObject(storage.value) && angular.isObject(cache)) {
              angular.extend(cache, transformLoad(storage.value));
            } else {
              cache = transformLoad(storage.value);
            }
            updateCache(cache, storage.key);
          }
          return cache;
        };
        // Treat as collection
        allAsCollection = function(callback) {
          LawnChair(function() {
            this.all(function(result) {
              angular.forEach(result, function(o) {
                updateCache(o.value, o.key);
              });
              if (callback) {
                callback(collection);
              }
            });
          });
          return collection;
        };
        // Treat as array
        allAsArray = function(callback) {
          return updateArray(allAsCollection(function(data) {
            updateArray(data);
            if (callback) {
              callback(array);
            }
          }));
        };
        // Remove entry
        removeEntry = function(key) {
          delete collection[key];
          LawnChair(function() {
            this.remove(key);
          });
        };
        // Get default
        getDefault = function(key) {
          var d;
          if (collection[key]) {
            return collection[key];
          } else {
            d = {};
            idGetter.assign(d, key);
            return d;
          }
        };
        // Define containers
        collection = {};
        array = [];
        isArray = config && config.isArray;
        idGetter = $parse((config && config.entryKey ? config.entryKey : 'id'));
        transformSave = (config && config.transformSave ? config.transformSave : angular.identity);
        transformLoad = (config && config.transformLoad ? config.transformLoad : angular.identity);
        // Create Store object
        Store = {
          // Pass the collection
          collection: collection,
          // Save a record
          save: function(data, key, clear) {
            var newIds;
            if (!data) {
              data = collection;
              key = null;
            }
            if (angular.isArray(data)) {
              angular.forEach(data, function(e, index) {
                saveEntry(e, getEntryId(e) || index);
              });
            } else if (key || (data && getEntryId(data))) {
              saveEntry(data, key || getEntryId(data));
            } else {
              angular.forEach(data, saveEntry);
            }
            if (clear) {
              newIds = (angular.isArray(data) ? _.chain(data).map(getEntryId).map(String).value() : _.keys(data));
              _.chain(collection).keys().difference(newIds).each(removeEntry);
              _.chain(collection).filter(function(entry) {
                return !getEntryId(entry);
              }).keys().each(removeEntry);
            }
            if (isArray) {
              updateArray(collection);
            }
          },
          // Batch treat records
          batch: function(keys, target, callback) {
            var cache;
            cache = _.chain(keys).map(function(k) {
              return getDefault(k);
            }).value();
            if (target && angular.isArray(target)) {
              target.length = 0;
              _.each(cache, function(o) {
                target.push(o);
              });
            } else {
              target = cache;
            }
            LawnChair(function() {
              this.get(keys, function(result) {
                var i;
                if (result) {
                  i = result.length - 1;
                  while (i >= 0) {
                    target[i] = updateCacheFromStorage(target[i], result[i]);
                    i--;
                  }
                }
                if (callback) {
                  callback(target);
                }
              });
            });
            return target;
          },
          // Get record(s)
          get: function(key, callback) {
            var value;
            value = getDefault(key);
            LawnChair(function() {
              this.get(key, function(result) {
                if (result) {
                  value = updateCacheFromStorage(value, result);
                }
                if (callback) {
                  callback(value);
                }
              });
            });
            return value;
          },
          // Treat all
          all: (isArray ? allAsArray : allAsCollection),
          // Remove a record
          remove: removeEntry,
          // Nuke localStorage
          nuke: function() {
            LawnChair(function() {
              this.nuke();
            });
          },
          // Destroy a collection
          destroy: function() {
            var key;
            for (key in collection) {
              delete collection[key];
            }
            LawnChair(function() {
              this.nuke();
            });
          }
        };
        // Return our Store object
        return Store;
      };
    }
  ]);
});