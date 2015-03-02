var tests = [];
for (var file in window.__karma__.files) {
  if (window.__karma__.files.hasOwnProperty(file)) {
    // Removed "Spec" naming from files
    if (/Spec\.js$/.test(file)) {
      tests.push(file);
    }
  }
}

requirejs.config(
  {
    baseUrl: '/base/app/scripts',

    paths: {
      jquery:   '../vendors/jquery/jquery.min',
      domReady: '../vendors/requirejs-domready/domReady',
      datatables: '../scripts/libs/datatables/1.10.4/media/js/jquery.dataTables',
      angular:  '../vendors/angular/angular',
      'angular-mocks': '../vendors/angular-mocks/angular-mocks',
      bootstrap:          '../vendors/bootstrap-sass/dist/js/bootstrap.min',
      'angular-strap': '../vendors/angular-strap/dist/angular-strap.min',
      'angular-strap-tpl': '../vendors/angular-strap/dist/angular-strap.tpl.min',
      'angular-resource': '../vendors/angular-resource/angular-resource.min',
      'angular-route':    '../vendors/angular-route/angular-route.min',
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
      'angular-strap':    { deps: ['angular'] },
      'angular-strap-tpl':{ deps: ['angular', 'angular-strap'] },
      lawnchair:          { exports: 'lawnchair' },
      dom:                { deps: ['lawnchair'], exports: 'dom' },
      moment:             { exports: 'moment' },
      'angular-datatables':{deps:['angular'],exports:'angular'},
      'datatables.tools':{exports:'datatables.tools'},
      'angular-mocks': {
        deps: ['angular'],
        exports: 'angular.mock'
      }
    },

    config: {
      moment: {
        noGlobal: true
      }
    },

    deps: tests,

    callback: window.__karma__.start
  }
);
