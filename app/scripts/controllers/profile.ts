/// <reference path="../typings/angularjs/angular.d.ts"/>
/// <reference path="../typings/bootstrap/bootstrap.d.ts"/>
import controllers = require('controllers/controllers');
'use strict';

var profile = controllers.controller('profile',
      [
        '$scope', '$rootScope', 'AskFast', 'Session', 'Store',
        function ($scope, $rootScope, AskFast, Session, Store )
        {
            AskFast.caller('info')
              .then(function (info)
				{
					Store('app').save({
                        user: info
                    });
				});
        }
      ]
    );

export = profile;
