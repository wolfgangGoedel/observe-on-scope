import * as ng from 'angular';
import registerMyComponent from './component';

const appModule = ng.module('app', []);
registerMyComponent(appModule);

ng.bootstrap(document, ['app']);