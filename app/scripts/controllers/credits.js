define(
    ['controllers/controllers', 'modals/askfast'],
    function(controllers, AskFast) {
        'use strict';

        controllers.controller('credits', [
            '$scope', '$rootScope', 'AskFast', 'Session', 'Store',
            function($scope, $rootScope, AskFast, Session, Store) {
                $scope.loading = true;
                AskFast.caller('info')
                    .then(function(info) {
                        //console.log(info);
                        Store('app').save({
                            user: info
                        });


                    });
                AskFast.caller('getAdapters')
                    .then(function(adapters) {
                        var adatperMap = {};
                        angular.forEach(adapters, function(adapter) {
                            adatperMap[adapter.configId] = adapter.adapterType;
                        });
                        console.log(adatperMap);
                        AskFast.caller('ddr')
                            .then(function(ddr) {
                                angular.forEach(ddr, function(drrlog) {
                                    drrlog['adapterName'] = adatperMap[drrlog['adapterId']];
                                });
                                $scope.logs = ddr;
                                $scope.loading = false;
                            });
                    });
                $scope.getAdapter = function(string) {
                    return $scope.result = '?';
                }

            }
        ]);
    }
);