define(["require", "exports", 'controllers/controllers'], function (require, exports, controllers) {
    'use strict';
    var logsController = controllers.controller('logs', ["$scope", "$routeParams", "$timeout", "LogsService", "moment", function ($scope, $routeParams, $timeout, LogsService, moment) {
        var vm = this;
        vm.ddrId = null;
        vm.currentSection = 'debugger';
        if ($routeParams['ddrId']) {
            vm.currentSection = 'details';
            vm.ddrId = $routeParams['ddrId'];
        }
        vm.loading = {
            logs: true
        };
        vm.query = {
            category: 'all',
            limit: 100,
            until: moment().format('DD/MM/YYYY')
        };
        vm.Log = {
            data: null,
            list: function () {
                var _period;
                if (vm.query.until) {
                    _period = moment(vm.query.until, 'DD/MM/YYYY').endOf('day').valueOf();
                }
                else {
                    _period = moment().endOf('day').valueOf();
                }
                vm.loading.logs = true;
                LogsService.list(vm.query.limit, _period, vm.query.category)
                    .then(function (logs) {
                    vm.logs = logs;
                    vm.loading.logs = false;
                })
                    .catch(function (err) {
                    console.log(err);
                });
            },
            categorize: function () {
                var category = vm.query.category;
                vm.logs = LogsService.categorize(category);
            },
            detail: function (ddrId) {
                LogsService.detail(ddrId)
                    .then(function (results) {
                    vm.ddrDetails = results[0];
                    if (angular.equals([], results[1])) {
                        vm.logs = null;
                    }
                    else {
                        vm.logs = results[1];
                    }
                    $timeout(function () {
                        // makes sure that first call to collapse doesn't toggle.
                        // if not done, collapseAll will expand untouched panels
                        $('.ddr-detail .panel-collapse').collapse({ toggle: false });
                    });
                })
                    .catch(function (err) {
                    console.warn(err);
                });
            }
        };
        if (!vm.ddrId) {
            vm.Log.list();
        }
        else {
            vm.Log.detail(vm.ddrId);
        }
        vm.expandAll = function () {
            $('.ddr-detail .panel-collapse').collapse('show');
        };
        vm.collapseAll = function () {
            $('.ddr-detail .panel-collapse').collapse('hide');
        };
        if ($.browser.msie && ($.browser.versionNumber === 10 || 11)) {
            // Disable the clear control ('X')
            vm.disableMsClear = true;
        }
    }]);
    return logsController;
});
