define(
  ['filters/filters'],
  function (filters)
  {
    'use strict';

    filters.filter('translateAdapterAddress',
      [
        'Store',
        function (Store)
        {
          Store = Store('data');

          var adapters = Store.get('adapterTypes');

          var adapterTypes = {};

//          angular.forEach(adapters, function (adp)
//          {
//            if (adp.configId == adapter.adapterID)
//            {
//              _adapter = '==> ' + adp.myAddress;
//            }
//          });
//
//          console.log('adapters ->', adapters);

          return function (adapter)
          {
            if (adapter && adapter.adapterType)
            {
              switch (adapter.adapterType)
              {
                case 'broadsoft':

                  if (/@/.test(adapter.myAddress))
                    return adapter.myAddress.split('@')[0];

                  break;
                default:
                  return adapter.myAddress;
              }
            }
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

    filters.filter('parseTimeStamp',
      ['Moment',
        function (Moment)
        {
          return function (stamp)
          {
            return Moment(stamp).format("dddd, MMMM Do YYYY, h:mm:ss a");
          }
        }
      ]
    );

  }
);
