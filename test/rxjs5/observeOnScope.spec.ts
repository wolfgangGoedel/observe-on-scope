import { IScope, IRootScopeService, ITimeoutService } from 'angular';
import { expect } from 'chai';
import { spy } from 'sinon';
import { Observable, TestScheduler } from 'rxjs';

import '../../src/rxjs5';
import '../registerAngular';

import * as angular from 'angular';

function createScope() {
  const testApp = ngModule('ng');
  let $scope: IScope;
  let $rootScope: IRootScopeService;
  inject((_$rootScope_: IRootScopeService) => {
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
  })

  return {$scope, $rootScope};
}

describe(`observeOnScope`, () => {
  it('should work with empty', () => {
    const {$scope} = createScope();
    const ts = new TestScheduler();

    


    const event = {};
    const obs = Observable.of(event);
    let actual: any;
    obs.observeOnScope($scope).subscribe(e => actual = e);
    expect(actual === event).to.be.true;
  });

  it('should complete when scope is destroyed', () => {
    const {$scope} = createScope();
    const obs = Observable.never();
    let completed = false;
    obs.observeOnScope($scope).subscribe(null, null, () => completed = true);
    
    $scope.$destroy();
    expect(completed).to.be.true;
  });
});

describe('$scope behaviour', () => {
  it('should apply function synchronously', () => {
    const {$scope} = createScope();
    let applied = false;
    $scope.$apply(() => applied = true);
    expect(applied).to.be.true;
  });

  it('should have its $$phase set when in a digest loop', () => {
    const {$scope} = createScope();
    let phase: any;
    $scope.$apply(() => phase = $scope.$$phase);
    expect(phase).not.to.be.undefined;
  });

  it('should have its $$phase set when its root in a digest loop', () => {
    const {$scope, $rootScope} = createScope();
    let phase: any;
    $rootScope.$apply(() => phase = $scope.$$phase);
    expect(phase).not.to.be.undefined;
  });

  it('should throw when calling $apply in a digest loop', () => {
    const {$scope, $rootScope} = createScope();
    const shouldThrow = () => $scope.$apply();
    expect(() => $rootScope.$apply(shouldThrow)).to.throw();
  });
});
