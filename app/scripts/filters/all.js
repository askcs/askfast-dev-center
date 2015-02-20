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
                case 'call':

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
              case 'call':
                return 'Phone';
              case 'xmpp':
                return 'Gtalk';
              case 'email':
                return 'Email';
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

    filters.filter('filterAdapters',
      [
        function ()
        {
          return function (adapters, dialog)
          {
            if (adapters && dialog)
            {
              var _adapters = [];

              angular.forEach(adapters, function (adapter)
              {
                if (adapter.dialogId == dialog.id) _adapters.push(adapter);
              });

              return _adapters;
            }
          }
        }
      ]
    );

    filters.filter('dashboardLogs',
      [
        function ()
        {
          return function (logs)
          {
            var i = 0;
            if (logs)
            {
              var _logs = [];

              angular.forEach(logs, function (log)
              {
                if (log.level == 'SEVERE'){
                  log.logId = i;
                  i += 1;
                  _logs.push(log);
                }
              });

              return _logs;
            }
          }
        }
      ]
    );

    filters.filter('mediumToType',
      [
        function() {
          return function(medium) {
            switch (medium)
            {
              case 'call':
                return 'Phone';
              case 'xmpp':
                return 'Gtalk';
              case 'email':
                return 'Email';
              case 'email':
                return 'SMS';
              default:
                return medium;
            }
          }
        }
      ]
    );

    filters.filter('accountType', function(){
      return function(type){
        switch (type)
        {
          case 'TRIAL':
            return 'Trial';
          case 'PRE_PAID':
            return 'Pre-paid';
          case 'POST_PAID':
            return 'Post-paid';
          default:
            return type;
        }
      };
    });

    filters.filter('paymentType', function(){
      return function(type){
        switch (type)
        {
          case 'PAYPAL':
            return 'Paypal';
          case 'CC':
            return 'Credit Card';
          default:
            return type;
        }
      };
    });
  }
);
