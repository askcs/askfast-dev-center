if (window.location.port == '8080')
{
  document.getElementsByTagName('html')[0].setAttribute('ng-app');
}

require.config (
  {
    paths: {
      jquery:   '../vendors/jquery/jquery.min',
      domReady: '../vendors/requirejs-domready/domReady',
      datatables: '../scripts/libs/datatables/1.10.4/media/js/jquery.dataTables',
      angular:  '../vendors/angular/angular',
      bootstrap:          '../vendors/bootstrap-sass/dist/js/bootstrap.min',
      'angular-resource': '../vendors/angular-resource/angular-resource.min',
      'angular-route':    '../vendors/angular-route/angular-route.min',
//      signet:     '../vendors/signet/signet.min',
      lawnchair:  '../vendors/lawnchair/src/Lawnchair',
      dom:        '../vendors/lawnchair/src/adapters/dom',
      moment:     '../vendors/momentjs/min/moment.min',
      'angular-datatables':'../vendors/angular-datatables/dist/angular-datatables',
      'datatables.tools':'../scripts/libs/datatables/1.10.4/extensions/TableTools/js/dataTables.tableTools.min'
      },
    shim: {
      angular:            { deps: ['jquery','datatables'], exports:  'angular' },
      datatables :        {deps:['jquery'],exports: 'jquery.datatables'},
      'angular-resource': { deps: ['angular'] },
      'angular-route':    { deps: ['angular'] },
      bootstrap:          { deps: ['jquery'], exports:  'bootstrap' },
      lawnchair:          { exports: 'lawnchair' },
      dom:                { deps: ['lawnchair'], exports: 'dom' },
      moment:             { exports: 'moment' },
      'angular-datatables':{deps:['angular'],exports:'angular'},
      'datatables.tools':{exports:'datatables.tools'}
    }
  }
);

require (
  [
    'angular',
    'domReady',
    'jquery',
    'angular-resource',
    'angular-route',
    'datatables',
    'angular-datatables',
    'datatables.tools',
    
    'localization',
    'config',
    'app',
    'routes',
    'run',

    'modals/askfast',

    'directives/navbar',
    'directives/profile',

    'filters/all',

    'services/session',
    'services/md5',
    'services/store',
    'services/moment',
    'services/offline',
    'services/interceptor',
    'services/logger',

    'controllers/core',
    'controllers/user',
	  'controllers/profile',
	  'controllers/dashboard',
	  'controllers/credits',
    'controllers/uselogs',

    'bootstrap',
//    'signet',
    'lawnchair',
    'dom',
    'moment'
    ],
  function (angular, domReady)
  {
    'use strict';

    domReady(function ()
      {
        angular.bootstrap(document, ['DevCen']);
      }
    );
  }
);