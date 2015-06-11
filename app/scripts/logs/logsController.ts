/// <reference path="../typings/angularjs/angular.d.ts"/>
/// <reference path="../typings/bootstrap/bootstrap.d.ts"/>
import controllers = require('controllers/controllers')
import logsService = require('./logsService');

'use strict';

var logsController = controllers.controller('logs',
  function (
    $scope: ng.IScope,
    $route,
    $location: ng.ILocationService,
    $timeout: ng.ITimeoutService,
    LogsService: logsService.ILogsService,
    moment)
  {
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

    vm.setSection = function (selection, clearDdrId)
    {
      if ($route.current.params.ddrId){
        vm.ddrId = null;
        $location.url('/logs');
      }

      if(clearDdrId){
        vm.ddrId = null;
      }

      vm.currentSection = selection;

      if(selection === 'debugger'){
        vm.logs = [];
        vm.Log.list();
      }
    };

    $scope.$on('$routeUpdate', function(){
      if ($route.current.params.ddrId && vm.ddrId === null){
        vm.ddrId = $route.current.params.ddrId;
        vm.currentSection = 'details';
        vm.Log.detail(vm.ddrId);
      }
      else if(vm.currentSection === 'details'){
        // means the user went back
        // the only links to 'details' are from 'debugger'
        vm.setSection('debugger', true);
      }
    });

    vm.query = {
      category: 'all',
      limit: 100,
      until: moment().format('DD/MM/YYYY')
    };

    vm.Log = {
      data: null,

      list: function ()
      {
        var _period;

        if(vm.query.until){
          _period = moment(vm.query.until, 'DD/MM/YYYY').endOf('day').valueOf();
        }
        else{
          _period = moment().endOf('day').valueOf();
        }

        vm.loading.logs = true;

        LogsService.list(vm.query.limit, _period)
        .then(function(logs){
          vm.logs = logs;
          vm.loading.logs = false
        })
        .catch(function(err){
          console.log(err);
        })
      },

      categorize: function ()
      {
        var category = vm.query.category;

        vm.logs = LogsService.categorize(category);
      },

      detail: function(ddrId: string)
      {
        LogsService.detail(ddrId)
        .then(function(results){
          vm.ddrDetails = results[0];

          vm.logs = results[1];

          $timeout(function(){
            // makes sure that first call to collapse doesn't toggle.
            // if not done, collapseAll will expand untouched panels
            $('.ddr-detail .panel-collapse').collapse({toggle:false});
          });

        })
        .catch(function(err){
          console.warn(err);
        })

      }
    };

    if(!vm.ddrId){
      vm.Log.list();
    }
    else{
      vm.Log.detail(vm.ddrId);
    }

    vm.expandAll = function(){
      $('.ddr-detail .panel-collapse').collapse('show');
    };

    vm.collapseAll = function(){
      $('.ddr-detail .panel-collapse').collapse('hide');
    };

  }
);

export = logsController;