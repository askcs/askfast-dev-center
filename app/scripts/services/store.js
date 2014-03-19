define(
  ['services/services'],
  function (services)
  {
    'use strict';

    services.factory('Store',
      [
        '$rootScope',
        function ($rootScope)
        {


          var store = new Lawnchair({name:'testing'}, function(store) {
            var me = {key:'a',firstName:'Clark',lastName:'Kent'};
            store.save(me);

            store.get('a', function(me) {
              console.log('got result ->', me.firstName + ' ' + me.lastName);
            });

          });


          // var store = new Lawnchair({adaptor:'dom', table:'people'});

// saving documents
          //store.save({name:'brian'});

// optionally pass a key
          //store.save({key:'config', settings:{color:'blue'}});

// updating a document in place is the same syntax
          //store.save({key:'config', settings:{color:'green'}});

          return true;



        }
      ]
    );
  }
);