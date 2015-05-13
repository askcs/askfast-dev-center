import directives = require('directives/directives');

'use strict';

var appVersionDirective = directives.directive('appVersion',
  function (version)
  {
    return function (scope, elm, attrs)
    {
      elm.text(version);
    };
  }
);

export = appVersionDirective;
