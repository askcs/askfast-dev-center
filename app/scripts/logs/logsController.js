define(["require", "exports", 'controllers/controllers'], function (require, exports, controllers) {
    'use strict';
    var logsController = controllers.controller('logs', function ($rootScope, $scope, $q, $route, $location, $timeout, LogsService, AskFast, Store, moment) {
        Store = Store('data');
        var vm = this;
        vm.ddrId = null;
        vm.currentSection = 'debugger';
        if ($route.current.params.ddrId) {
            vm.currentSection = 'details';
            vm.ddrId = $route.current.params.ddrId;
        }
        vm.loading = {
            logs: true
        };
        vm.setSection = function (selection, clearDdrId) {
            if ($route.current.params.ddrId) {
                vm.ddrId = null;
                $location.url('/logs');
            }
            if (clearDdrId) {
                vm.ddrId = null;
            }
            vm.currentSection = selection;
            if (selection === 'debugger') {
                vm.logs = [];
                vm.Log.list();
            }
        };
        $scope.$on('$routeUpdate', function () {
            if ($route.current.params.ddrId && vm.ddrId === null) {
                vm.ddrId = $route.current.params.ddrId;
                vm.currentSection = 'details';
                vm.Log.detail(vm.ddrId);
            }
            else if (vm.currentSection === 'details') {
                // means the user went back
                // the only links to 'details' are from 'debugger'
                vm.setSection('debugger', true);
            }
        });
        vm.types = [
            'Phone',
            'SMS',
            'Gtalk',
            'Email',
            'Twitter'
        ];
        vm.adapterTypes = {
            call: {
                label: 'Phone',
                ids: []
            },
            xmpp: {
                label: 'Gtalk',
                ids: []
            },
            email: {
                label: 'Email',
                ids: []
            },
            twitter: {
                label: 'Twitter',
                ids: []
            },
            sms: {
                label: 'SMS',
                ids: []
            }
        };
        vm.channel = {
            type: null,
            adapter: null
        };
        vm.forms = {};
        vm.candidates = [];
        vm.channelTypeSelected = function () {
            var candidates = [];
            angular.forEach(vm.adapterTypes, function (type) {
                if (type.label == vm.channel.type) {
                    angular.forEach(type.ids, function (id) {
                        angular.forEach(vm.adapters, function (adapter) {
                            if (adapter.configId == id)
                                candidates.push(adapter);
                        });
                    });
                }
            });
            vm.candidates = candidates;
        };
        vm.dialogAuth = {
            open: false,
            message: '',
            messageType: ''
        };
        vm.resetAdapterMenu = function () {
            vm.channel.type = null;
            vm.channel.adapter = null;
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
                LogsService.list(vm.query.limit, _period)
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
                    vm.logs = results[1];
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
        vm.Adapter = {
            list: function (callback) {
                vm.adapterType = '';
                AskFast.caller('getAdapters')
                    .then(function (adapters) {
                    angular.forEach(adapters, function (adapter) {
                        if (adapter.adapterType in vm.adapterTypes) {
                            var ids = vm.adapterTypes[adapter.adapterType].ids;
                            if (ids.indexOf(adapter.configId) == -1)
                                ids.push(adapter.configId);
                        }
                    });
                    Store.save(vm.adapterTypes, 'adapterTypes');
                    vm.adapters = adapters;
                    if (callback)
                        callback.call(null, adapters);
                });
            },
            add: function (adapter) {
                AskFast.caller('createAdapter', {
                    second: adapter.configId
                }).then((function () {
                    this.list();
                    // reset adapter add form
                    vm.adapterType = '';
                }).bind(this));
            },
            // TODO: Add changing dialog info later on
            //            update: function (dialog)
            //            {
            //              AskFast.caller('updateAdapter', { second: vm.channel.adapter },
            //                {
            //                  dialogId: dialog.id
            //                }).then((function ()
            //              {
            //                this.list();
            //
            //                vm.Adapter.adapters();
            //              }).bind(this));
            //            },
            query: function (type) {
                AskFast.caller('freeAdapters', {
                    adapterType: type
                })
                    .then(function (result) {
                    vm.freeAdapters = result;
                });
            },
            remove: function (adapter) {
                AskFast.caller('removeAdapter', {
                    second: adapter.configId
                }).then((function () {
                    this.list();
                }).bind(this));
            }
        };
        vm.Adapter.list();
        vm.expandAll = function () {
            $('.ddr-detail .panel-collapse').collapse('show');
        };
        vm.collapseAll = function () {
            $('.ddr-detail .panel-collapse').collapse('hide');
        };
    });
    return logsController;
});
