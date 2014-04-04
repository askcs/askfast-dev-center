define(
  ['filters/filters'],
  function (filters)
  {
    'use strict';

    filters.filter('translateAdapterAddress',
      [
        function ()
        {
          return function (adapter)
          {
            var address = adapter.myAddress;

            switch (adapter.adapterType)
            {
              case 'broadsoft':
                address = adapter.myAddress.split('@')[0];
                break;
            }

            return address;
          }
        }
      ]
    );

    filters.filter('translateAdapterType',
      [
        function ()
        {
          return function (adapter)
          {
            var address = adapter.adapterType;

            switch (address)
            {
              case 'broadsoft':
                return 'Phone';
                break;
              case 'xmpp':
                return 'Gtalk';
                break;
              case 'email':
                return 'Email';
                break;
              default:
                return address;
            }
          }
        }
      ]
    );


    filters.filter('getAdapterAddress',
      ['Store',
        function (Store)
        {
          return function (log)
          {
            Store = Store('data');

            var adapterTypes = Store.get('adapterTypes');

            return log;
          }
        }
      ]
    );



    filters.filter('getAdapterAddress',
      ['Store',
        function (Store)
        {
          return function (log)
          {
            Store = Store('data');

            var adapterTypes = Store.get('adapterTypes');

            return log;
          }
        }
      ]
    );



  }
);
