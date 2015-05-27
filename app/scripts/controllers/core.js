define(["require", "exports", 'controllers/controllers'], function (require, exports, controllers) {
    'use strict';
    var coreController = controllers.controller('core', function ($rootScope, $scope, $q, $route, $location, $timeout, AskFast, Store, moment) {
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
                $location.url('/developer');
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
        function processDdr(ddrLog, ddrTypes, adapterMap) {
            if (ddrLog.start) {
                ddrLog.startString = moment(ddrLog.start).format('HH:mm:ss Z YYYY-MM-DD');
                if (ddrLog.duration !== null) {
                    ddrLog.endString = moment(ddrLog.start + ddrLog.duration).format('HH:mm:ss Z YYYY-MM-DD');
                }
                else {
                    ddrLog.endString = '-';
                }
            }
            else {
                ddrLog.startString = '-';
                ddrLog.endString = '-';
            }
            ddrLog.fromAddress = ddrLog.fromAddress || '-';
            ddrLog.toAddress = ddrLog.toAddressString ? Object.keys(angular.fromJson(ddrLog.toAddressString))[0] : '-';
            ddrLog.ddrTypeString = ddrLog.ddrTypeId ? getDdrTypeString(ddrLog.ddrTypeId, ddrTypes) : '-';
            // there's no way to get the index from ng-repeat, make an object out of it
            if (ddrLog.statusPerAddress) {
                angular.forEach(ddrLog.statusPerAddress, function (item, index) {
                    ddrLog.statusPerAddress[index] = { index: index, status: item };
                });
            }
            ddrLog.adapterTypeString = ddrLog.adapterId ? getAdapterTypeString(ddrLog.adapterId, adapterMap) : '-';
            return ddrLog;
        }
        function getDdrTypeString(ddrTypeId, ddrTypes) {
            if (typeof ddrTypes[ddrTypeId] !== 'undefined' && typeof ddrTypes[ddrTypeId].categoryString !== 'undefined') {
                return ddrTypes[ddrTypeId].categoryString;
            }
            else {
                return 'Unknown';
            }
        }
        function getAdapterTypeString(adapterId, adapterMap) {
            if (typeof adapterMap[adapterId] !== 'undefined') {
                return vm.adapterTypes[adapterMap[adapterId]].label;
            }
            else {
                return 'Unknown';
            }
        }
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
                AskFast.caller('ddr', {
                    limit: vm.query.limit,
                    endTime: _period
                })
                    .then((function (ddr) {
                    var ddrTypes = Store.get('ddrTypes');
                    var adapterMap = Store.get('adapterMap');
                    var logs = {
                        call: [],
                        email: [],
                        sms: [],
                        xmpp: [],
                        twitter: [],
                        other: []
                    };
                    var allLogs = [];
                    angular.forEach(ddr, function (ddrLog) {
                        allLogs.push(processDdr(ddrLog, ddrTypes, adapterMap));
                    });
                    angular.forEach(allLogs, function (ddrLog) {
                        var gotPushed = false;
                        angular.forEach(adapterMap, function (adapterType, adapterId) {
                            if (ddrLog.adapterId == adapterId) {
                                if (logs[adapterMap[ddrLog.adapterId]]) {
                                    logs[adapterMap[ddrLog.adapterId]].push(ddrLog);
                                    gotPushed = true;
                                }
                            }
                        });
                        if (!gotPushed) {
                            logs.other.push(ddrLog);
                        }
                    });
                    this.data = logs;
                    this.categorize();
                    vm.loading.logs = false;
                }).bind(this));
            },
            categorize: function () {
                var category = vm.query.category;
                if (category && category !== 'all') {
                    vm.logs = this.data[category];
                }
                else {
                    // vm.query.category is ALL
                    var logs = [], data = this.data;
                    angular.forEach(data, function (segment) {
                        angular.forEach(segment, function (log) {
                            logs.push(log);
                        });
                    });
                    vm.logs = logs;
                }
            },
            detail: function (ddrId) {
                var ddrTypes = Store.get('ddrTypes');
                var adapterMap = Store.get('adapterMap');
                $q.all([AskFast.caller('ddrRecord', {
                        second: ddrId
                    }),
                    AskFast.caller('log', {
                        ddrRecordId: ddrId
                    })])
                    .then(function (resultArray) {
                    vm.ddrDetails = processDdr(resultArray[0], ddrTypes, adapterMap);
                    var logs = resultArray[1];
                    angular.forEach(logs, function (item) {
                        if (item.timestamp) {
                            item.timeString = moment(item.timestamp).format('HH:mm:ss Z YYYY-MM-DD');
                        }
                        item.requestLog = {
                            url: 'testUrl',
                            httpMethod: 'someHttpMethod',
                            parameters: {
                                'one': 'oneParameter',
                                'two': 'twoParameter'
                            },
                            timestamp: item.timestamp
                        };
                        item.responseLog = {
                            headers: {
                                'one': 'oneHeader',
                                'two': 'twoHeader'
                            },
                            responseBody: 'responseBody',
                            httpCode: 200,
                            httpResponseTime: 'some timestamp time'
                        };
                    });
                    vm.logs = logs;
                    $timeout(function () {
                        // makes sure that first call to collapse doesn't toggle.
                        // if not done, collapseAll will expand untouched panels
                        $('.ddr-detail .panel-collapse').collapse({ toggle: false });
                    });
                }, function (result) {
                    console.warn('error ', result);
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
        vm.Dialog = {
            list: function (callback) {
                AskFast.caller('getDialog')
                    .then(function (dialogs) {
                    vm.dialogs = dialogs;
                    vm.loadingDialogs = true;
                    if (callback)
                        callback.call();
                });
            },
            add: function (dialog) {
                if (dialog.form.name && dialog.form.url) {
                    AskFast.caller('createDialog', null, {
                        name: dialog.form.name,
                        url: dialog.form.url
                    })
                        .then((function (result) {
                        vm.addingDialog = false;
                        this.list(function () {
                            vm.setSection('dialogs');
                            openDialog(result);
                            // close auth menu if it was open
                            vm.dialogAuth = false;
                        });
                    }).bind(this));
                }
            },
            remove: function (dialog) {
                AskFast.caller('deleteDialog', {
                    third: dialog.id
                })
                    .then((function () {
                    vm.addingDialog = false;
                    this.list(function () {
                        vm.dialog = null;
                        if (vm.dialogs[0])
                            vm.dialog = vm.dialogs[0];
                        vm.setSection('dialogs');
                    });
                }).bind(this));
            },
            update: function (dialog, deferred) {
                var dialogObject = {
                    id: dialog.id,
                    name: dialog.name,
                    url: dialog.url,
                    owner: dialog.owner
                };
                if (angular.isDefined(dialog.userName) &&
                    angular.isDefined(dialog.password) &&
                    angular.isDefined(dialog.useBasicAuth)) {
                    dialogObject.userName = dialog.userName;
                    dialogObject.password = dialog.password;
                    dialogObject.useBasicAuth = dialog.useBasicAuth;
                }
                AskFast.caller('updateDialog', {
                    third: dialog.id
                }, dialogObject)
                    .then((function (result) {
                    if (deferred) {
                        if (result.error) {
                            deferred.reject(result);
                        }
                        else {
                            deferred.resolve(result);
                        }
                    }
                    this.list();
                }).bind(this));
            },
            updateDetails: function (dialog) {
                var dialogArr = vm.dialogs.filter(function (_dialog) {
                    if (_dialog.id === dialog.id) {
                        return true;
                    }
                    else {
                        return false;
                    }
                });
                //we're not updating other properties, reset
                dialog.userName = dialogArr[0].userName;
                dialog.password = dialogArr[0].password;
                this.update(dialog);
            },
            adapters: {
                list: function (dialogId, updated) {
                    var adapters = [];
                    angular.forEach(vm.adapters, function (adapter) {
                        if (updated && updated.id == adapter.id) {
                            adapters.push(updated);
                        }
                        else {
                            if (adapter.dialogId == dialogId)
                                adapters.push(adapter);
                        }
                    });
                    return adapters;
                },
                update: function (dialogId, adapterId) {
                    AskFast.caller('updateAdapter', { second: adapterId }, { dialogId: dialogId })
                        .then((function (adapter) {
                        // vm.dialogAdapters = this.list(dialogId, adapter);
                        vm.Adapter.list();
                    }).bind(this));
                },
                add: function (dialog) {
                    this.update(dialog.id, vm.channel.adapter);
                    vm.resetAdapterMenu();
                    vm.candidates = [];
                    openDialog(dialog);
                },
                remove: function (adapter) {
                    this.update('', adapter.configId);
                }
            },
            open: function (dialog) {
                vm.dialog = angular.copy(dialog);
                // cancel auth notification if any
                vm.Dialog.authentication.notify(null, null, true);
                // will be undefined on first load
                if (angular.isDefined(vm.forms.details)) {
                    vm.forms.details.$setPristine();
                    if (this.adapters.list(dialog.id))
                        vm.dialogAdapters = this.adapters.list(dialog.id);
                }
            },
            authentication: {
                enable: function (dialog) {
                    //check with falsiness, could be null, undefined or empty string
                    if (!!dialog.userName && !!dialog.password) {
                        dialog.useBasicAuth = true;
                    }
                    else {
                        this.notify('Please fill in both a Username and a Password', 'warning');
                        return;
                    }
                    var dialogArr = vm.dialogs.filter(function (_dialog) {
                        if (_dialog.id === dialog.id) {
                            return true;
                        }
                        else {
                            return false;
                        }
                    });
                    //we're not updating other properties, reset
                    dialog.name = dialogArr[0].name;
                    dialog.url = dialogArr[0].url;
                    var deferred = $q.defer();
                    vm.Dialog.update(dialog, deferred);
                    deferred.promise
                        .then(function (result) {
                        //success
                        vm.dialogAuth.open = false;
                        this.notify('Basic Authentication applied successfully', 'success');
                    }.bind(this))
                        .catch(function (result) {
                        //something went wrong, handle it
                        console.log('error -> ', result);
                        this.notify('Something went wrong with the request', 'danger');
                    }.bind(this));
                },
                disable: function (dialog) {
                    var dialogObj;
                    dialog.useBasicAuth = false;
                    var dialogArr = vm.dialogs.filter(function (_dialog) {
                        if (_dialog.id === dialog.id) {
                            return true;
                        }
                        else {
                            return false;
                        }
                    });
                    //we're not updating other properties, reset
                    dialog.name = dialogArr[0].name;
                    dialog.url = dialogArr[0].url;
                    dialogObj = angular.copy(dialog);
                    dialogObj.userName = null;
                    dialogObj.password = null;
                    var deferred = $q.defer();
                    vm.Dialog.update(dialogObj, deferred);
                    deferred.promise
                        .then(function (result) {
                        //success
                        vm.dialogAuth.open = false;
                        this.notify('Basic Authentication successfully disabled', 'success');
                    }.bind(vm.Dialog.authentication))
                        .catch(function (result) {
                        //something went wrong, handle it
                        console.log('error -> ', result);
                        this.notify('Something went wrong with the request', 'danger');
                    }.bind(vm.Dialog.authentication));
                },
                notify: function (message, type, cancel) {
                    if (cancel) {
                        vm.dialogAuth.message = '';
                    }
                    vm.dialogAuth.message = message;
                    vm.dialogAuth.messageType = type;
                    if (vm.authNotifyTimeoutPromise) {
                        $timeout.cancel(vm.authNotifyTimeoutPromise);
                    }
                    vm.authNotifyTimeoutPromise = $timeout(function () {
                        vm.dialogAuth.message = '';
                    }, 6000);
                },
                cancel: function (dialog) {
                    var dialogArr = vm.dialogs.filter(function (_dialog) {
                        if (_dialog.id === dialog.id) {
                            return true;
                        }
                        else {
                            return false;
                        }
                    });
                    // Only reset userName and password
                    vm.dialog.userName = dialogArr[0].userName;
                    vm.dialog.password = dialogArr[0].password;
                    vm.dialogAuth.open = false;
                    vm.forms.auth.$setPristine();
                }
            }
        };
        function openDialog(dialog) {
            vm.Dialog.open(dialog);
        }
        vm.authenticateDialog = function (dialog) {
            vm.Dialog.authentication.enable(dialog);
        };
        vm.disableDialogAuthentication = function (dialog) {
            vm.Dialog.authentication.disable(dialog);
        };
        vm.cancelAuthentication = function (dialog) {
            vm.Dialog.authentication.cancel(dialog);
        };
        vm.expandAll = function () {
            $('.ddr-detail .panel-collapse').collapse('show');
        };
        vm.collapseAll = function () {
            $('.ddr-detail .panel-collapse').collapse('hide');
        };
        // grab the list, then select the first if exists
        vm.Dialog.list(function () {
            if (vm.dialogs.length > 0)
                vm.Dialog.open(vm.dialogs[0]);
        });
    });
    return coreController;
});
