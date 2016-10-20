global.window.mocha = {};
global.window.beforeEach = beforeEach;
global.window.afterEach = afterEach;

delete require.cache[require.resolve('angular')];
delete require.cache[require.resolve('angular/angular')];
delete require.cache[require.resolve('angular-mocks')];

require('angular/angular');
require('angular-mocks');

global.angular = global.window.angular;
global.inject = global.angular.mock.inject;
global.ngModule = global.angular.mock.module;