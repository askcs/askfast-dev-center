module.exports = function (karma)
{
  'use strict';

  karma.set({
    frameworks: ['jasmine', 'requirejs'],
    files: [
      {pattern: 'app/vendors/jquery/jquery.min.js',        included: false},
      {pattern: 'app/vendors/angular/angular.js',        included: false},
      {pattern: 'app/vendors/angular-mocks/angular-mocks.js',        included: false},
      {pattern: 'app/vendors/bootstrap-sass/dist/js/bootstrap.min.js',        included: false},
      {pattern: 'app/vendors/angular-strap/dist/angular-strap.min.js',        included: false},
      {pattern: 'app/vendors/angular-strap/dist/angular-strap.tpl.min.js',        included: false},
      {pattern: 'app/vendors/angular-resource/angular-resource.min.js',        included: false},
      {pattern: 'app/vendors/angular-route/angular-route.min.js',        included: false},
      {pattern: 'app/vendors/lawnchair/src/Lawnchair.js',        included: false},
      {pattern: 'app/vendors/lawnchair/src/adapters/dom.js',        included: false},
      {pattern: 'app/vendors/momentjs/min/moment.min.js',        included: false},
      {pattern: 'app/vendors/angular-datatables/dist/angular-datatables.js',        included: false},
      // {pattern: 'app/vendors/**/*.js',        included: false},
      {pattern: 'app/scripts/*.js',           included: false},
      {pattern: 'app/scripts/**/*.js',        included: false},
      {pattern: 'app/scripts/**/*.coffee',        included: false},
      {pattern: 'test/spec/controllers/*.js', included: false},
      // {pattern: 'test/spec/directives/*.js',  included: false},
      // {pattern: 'test/spec/filters/*.js',     included: false},
      // {pattern: 'test/spec/services/*.js',    included: false},
      'test/spec/test-unit-main.js'
    ],
    basePath: '',
    exclude: [
      'app/scripts/main.js',
      'app/scripts/libs/**/*Spec.js'
    ],
    port: 8080,
    logLevel: karma.LOG_INFO,
    autoWatch: false,
    browsers: ['PhantomJS'],
    captureTimeout: 10000,
    singleRun: false,
    preprocessors: {
      '**/*.coffee': ['coffee']
    },
    coffeePreprocessor: {
      // options passed to the coffee compiler
      options: {
        bare: true,
        map: false
      },
      // transforming the filenames
      transformPath: function(path) {
        return path.replace(/\.coffee$/, '.js');
      }
    }
  });
};
