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
                        AskFast.caller('ddr')
                            .then(function(ddr) {
                                angular.forEach(ddr, function(drrlog) {
                                    drrlog['adapterName'] = adatperMap[drrlog['adapterId']];
                                });
                                $scope.logs = ddr;
                                $scope.loading = false;
                            });
                    });
                $scope.getDuration = function(string) {
                    if(string){
                        return $scope.result =moment.utc(string).format("HH:mm:ss");
                    }else{
                        return $scope.result = '';
                    }
                }
                $scope.getPropperAdress = function(string){
                    if (string.indexOf('@ask-ask-voipit-nl') >= 0) {
                        var num = string.replace('@ask-ask-voipit-nl','');
                        num= num.slice(1);
                        num = '+31'+num;
                        return $scope.result = num;
                    }else{
                        return $scope.result = string;
                    }
                } 

            }
        ]);
    }
);