define(
    ['controllers/controllers', 'modals/askfast'],
    function(controllers, AskFast) {
        'use strict';

        controllers.controller('credits', [
            '$scope', '$rootScope', 'AskFast', 'Session', 'Store', 'DTOptionsBuilder', 'DTColumnDefBuilder',
            function($scope, $rootScope, AskFast, Session, Store, DTOptionsBuilder, DTColumnDefBuilder) {
                $scope.loading = true;
                $scope.paypal = false;
                $scope.creditForm = true;
                AskFast.caller('info')
                    .then(function(info) {
                        //TODO set propper atribute
                        
                        Store('app').save({
                            user: info
                        });
                    });
                AskFast.caller('paymentMethods')
                    .then(function(methods){
                        if(/*methods.indexOf('paypal')>-1*/true){
                            $scope.paypal = true
                             paypal.use( ["login"], function(login) {
                                login.render ({
                                    "appid": "ARCOQRDKLNqTLrm3_io3FKmaLLCSKqsNVtYRn85OkWnh8H9I1GpYRjkZDRzl",
                                    "scopes": "profile email address phone https://uri.paypal.com/services/paypalattributes",
                                    "containerid": "payPalLogin",
                                    "locale": "nl-nl",
                                    "returnurl": "portal.ask-fast.com",
                                    "authend":"sandbox"
                                });
                            });
                        }
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
                    if (string) {
                        return $scope.result = moment.utc(string).format("HH:mm:ss");
                    } else {
                        return $scope.result = '';
                    }
                }

                $scope.dtOptions = DTOptionsBuilder
                    .newOptions()
                    // Add Table tools compatibility
                    .withTableTools('../scripts/libs/datatables/1.10.4/extensions/TableTools/swf/copy_csv_xls_pdf.swf')
                    .withTableToolsButtons([
                        'copy',
                        'print', {
                            'sExtends': 'collection',
                            'sButtonText': 'Save',
                            'aButtons': ['csv', 'xls', 'pdf']
                        }
                    ]);
                    $scope.dtOptions = {
                         order: [[0, 'desc']]
                    }
                $scope.dtColumnDefs = [
                    DTColumnDefBuilder.newColumnDef(0),
                    DTColumnDefBuilder.newColumnDef(1),
                    DTColumnDefBuilder.newColumnDef(2)
                ];

                $scope.getPropperAdress = function(address) {
                    if (address.indexOf('@') >= 0) {
                        var num = address.substring(0, address.indexOf('@'));
                        num = num.slice(1);
                        num = '+31' + num;
                        return $scope.result = num;
                    } else {
                        return $scope.result = address;
                    }
                }

                $scope.buyCredits = function(){
                    $scope.creditButton = true;
                    $scope.creditForm = false;
                }

            }
        ]);
    }
);