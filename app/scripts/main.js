if (window.location.port == '8080')
{
  document.getElementsByTagName('html')[0].setAttribute('ng-app');
}

require.config (
  {
    paths: {
      jquery:   '../vendors/jquery/jquery.min',
      domReady: '../vendors/requirejs-domready/domReady',
      angular:  '../vendors/angular/angular',
      bootstrap:          '../vendors/bootstrap-sass/dist/js/bootstrap.min',
      'angular-resource': '../vendors/angular-resource/angular-resource.min',
      'angular-route':    '../vendors/angular-route/angular-route.min',
      signet:   '../vendors/signet/signet.min',
      lawnchair: '../vendors/lawnchair/src/Lawnchair',
      dom: '../vendors/lawnchair/src/adapters/dom',
      'indexed-db': '../vendors/lawnchair/src/adapters/indexed-db'
    },
    shim: {
      angular:            { deps: ['jquery'], exports:  'angular' },
      'angular-resource': { deps: ['angular'] },
      'angular-route':    { deps: ['angular'] },
      bootstrap:          { deps: ['jquery'], exports:  'bootstrap' },
      lawnchair:          { exports: 'lawnchair' },
      dom:                { deps: ['lawnchair'], exports: 'dom' },
      'indexed-db':       { deps: ['lawnchair'], exports: 'indexed-db' }
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
    'localization',
    'config',
    'app',
    'routes',
    'run',
    'modals/askfast',
    'directives/appVersion',
    'filters/interpolate',
    'services/session',
    'services/md5',
    'services/store',
    'services/offline',
    'services/interceptor',
    'controllers/home',
    'controllers/register',
    'controllers/login',
    'controllers/logout',
    'bootstrap',
    'signet',
    'lawnchair',
    'dom',
    'indexed-db'
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