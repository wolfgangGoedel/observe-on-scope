///<reference path="../node_modules/@types/angular-mocks/index.d.ts" />
const g = <any>global;

// make angular-mocks know about mocha
// but fake before and after - we'll call them later
// so the one time angular-mocks is executed
// it does not call them on its own
g.window.mocha = {};
g.window.beforeEach = () => {};
g.window.afterEach = () => {};

require('angular-mocks');

g.angular = g.window.angular;
g.mock = g.angular.mock;
g.inject = g.mock.inject;

// call before and after each
// this must be done for every test run
// (for watch moch to work)
beforeEach(g.mock.module.$$beforeEach);
afterEach(g.mock.module.$$afterEach);

declare const angular: ng.IAngularStatic;
declare const mock: ng.IMockStatic;
