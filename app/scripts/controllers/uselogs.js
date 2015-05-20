define(["require", "exports", 'controllers/controllers'], function (require, exports, controllers) {
    'use strict';
    var uselogsController = controllers.controller('uselogs', function ($scope, $rootScope, AskFast, Session, Store, DTOptionsBuilder, DTColumnDefBuilder) {
        $scope.loading = true;
        AskFast.caller('getAdapters')
            .then(function (adapters) {
            var adapterMap = {};
            angular.forEach(adapters, function (adapter) {
                adapterMap[adapter.configId] = adapter.adapterType;
            });
            AskFast.caller('ddr')
                .then(function (ddr) {
                angular.forEach(ddr, function (drrlog) {
                    drrlog['adapterName'] = adapterMap[drrlog['adapterId']];
                });
                $scope.logs = ddr;
                $scope.loading = false;
            });
        });
        $scope.getDuration = function (string) {
            if (string) {
                return $scope.result = moment.utc(string).format("HH:mm:ss");
            }
            else {
                return $scope.result = '';
            }
        };
        $scope.dtOptions = DTOptionsBuilder
            .newOptions()
            .withTableTools('../scripts/libs/datatables/1.10.4/extensions/TableTools/swf/copy_csv_xls_pdf.swf')
            .withTableToolsButtons([
            'copy',
            'print', {
                'sExtends': 'collection',
                'sButtonText': 'Save',
                'aButtons': ['csv', 'xls', 'pdf']
            }
        ])
            .withOption('order', [[0, 'desc']]);
        $scope.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2)
        ];
        $scope.getPropperAdress = function (address) {
            if (address.indexOf('@') >= 0) {
                var num = address.substring(0, address.indexOf('@'));
                num = num.slice(1);
                num = '+31' + num;
                return $scope.result = num;
            }
            else {
                return $scope.result = address;
            }
        };
    });
    return uselogsController;
});
