define(
  ['services/services'],
  function (services)
  {
    'use strict';

    services.factory('Phone',
      [
        function ()
        {
          function parse(number, country, carrier)
          {
            var result = phoneNumberParser(number, country, carrier);

            result.parsed = angular.fromJson(result.parsed);

            return result;
          }

          return {
            parse: parse
          };

        }
      ]
    );
  }
);