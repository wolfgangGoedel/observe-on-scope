import { IScope } from 'angular';
import { expect } from 'chai';
import { spy } from 'sinon';
import { Observable } from 'rxjs';

import '../setupDom';
import '../setupAngular';

import '../../src/rxjs5';

import * as angular from 'angular';

describe(`observeOnScope`, () => {
  it('should not alter events', () => {
    const injector = angular.injector(['ng']);
    const $rootScope: ng.IRootScopeService = injector.get('$rootScope');
    const scope = $rootScope.$new();
    const event = {};
    const obs = Observable.of(event);
    let actual: any;
    obs.observeOnScope(scope).subscribe(e => actual = e);
    expect(actual === event).to.be.true;
  });

  it('should complete when scope is destroyed', () => {
    const injector = angular.injector(['ng']);
    const $rootScope: ng.IRootScopeService = injector.get('$rootScope');
    const scope = $rootScope.$new();
    const obs = Observable.never();
    let completed = false;
    obs.observeOnScope(scope).subscribe(null, null, () => completed = true);
    
    scope.$destroy();
    expect(completed).to.be.true;
  });
});