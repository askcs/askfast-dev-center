// conf.js
exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['test/e2e/**/*Spec.js'],
  framework: 'jasmine2',
  capabilities: {
    browserName: 'chrome'
  },
  onPrepare: function(){
    var reporters = require('jasmine-reporters');
    jasmine.getEnv().addReporter(new reporters.JUnitXmlReporter());
  }
};