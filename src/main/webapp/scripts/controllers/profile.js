define(["require", "exports", 'controllers/controllers'], function (require, exports, controllers) {
    'use strict';
    var profile = controllers.controller('profile', ["$scope", "$rootScope", "AskFast", "Session", "Store", function ($scope, $rootScope, AskFast, Session, Store) {
        AskFast.caller('info')
            .then(function (info) {
            Store('app').save({
                user: info
            });
        });
    }]);
    return profile;
});
