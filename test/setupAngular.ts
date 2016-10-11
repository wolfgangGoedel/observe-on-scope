import 'angular/angular';
import 'angular-mocks';

const angular: ng.IAngularStatic = (<any>window).angular;
const ngInject = angular.mock.inject;
const ngModule = angular.mock.module;

Object.assign(global, {angular, ngInject, ngModule});