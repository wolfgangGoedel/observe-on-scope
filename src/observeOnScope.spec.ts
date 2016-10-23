import { IScope, IRootScopeService } from 'angular';
import { expect } from 'chai';
import { spy, stub, SinonSpy } from 'sinon';
import { Observable, Subject, Subscriber } from 'rxjs';
import '../test/mocks';
import './index';

function createScope() {
  let $scope: IScope;
  let $rootScope: IRootScopeService;
  inject((_$rootScope_: IRootScopeService) => {
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
  });
  return {$scope, $rootScope};
}

function provideExceptionHandler($provide: ng.auto.IProvideService) {
  $provide.constant('$exceptionHandler', spy());
}

describe(`observeOnScope`, () => {

  beforeEach(mock.module(provideExceptionHandler));

  describe('applies correctly', () => {
    it('should propagate next in scope.$apply() context', () => {
      const {$scope} = createScope();
      let phase: string;
      Observable.never<boolean>().startWith(true)
        .observeOnScope($scope)
        .subscribe(
          _ => phase = $scope.$$phase,
          _ => {},
          () => {}
        );
      expect(phase).to.equal('$apply');
    });

    it('should propagate error in scope.$apply() context', () => {
      const {$scope} = createScope();
      let phase: string;
      Observable.of(true).map(_ => { throw "error" })
        .observeOnScope($scope)
        .subscribe(
          _ => {},
          _ => phase = $scope.$$phase,
          () => {}
        );
      expect(phase).to.equal('$apply');
    });

    it('should propagate complete in scope.$apply() context', () => {
      const {$scope} = createScope();
      let phase: string;
      Observable.empty()
        .observeOnScope($scope)
        .subscribe(
          _ => {},
          _ => {},
          () => phase = $scope.$$phase
        );
      expect(phase).to.equal('$apply');
    });

    it('should not throw when already applied', () => {
      const {$scope} = createScope();
      const source = new Subject<void>();
      let calledWithoutError = false;
      source
        .observeOnScope($scope)
        .subscribe(
          _ => calledWithoutError = true,
          _ => { throw "must not error"; }
        );
      $scope.$apply(() => source.next());
      expect(calledWithoutError).to.be.true;
    });

    it('should let $exceptionHandler catch errors not handled in subscribe', () => {
      let $exceptionHandler: SinonSpy;
      inject((_$exceptionHandler_: any) => $exceptionHandler = _$exceptionHandler_);
      const {$scope} = createScope();
      const source = new Subject<void>();
      source
        .observeOnScope($scope)
        .subscribe();
      source.error("some error");
      expect($exceptionHandler.calledOnce).to.be.true;
    });
  });
  
  describe('lifecyle', () => {
    it('should complete when scope is destroyed', () => {
      const {$scope} = createScope();
      const obs = Observable.never();
      let completed = false;
      obs.observeOnScope($scope).subscribe(null, null, () => completed = true);
      
      $scope.$destroy();
      expect(completed).to.be.true;
    });

    it('should unsubscribe from source when scope in destroyed', () => {
      const {$scope} = createScope();
      let unsubscribed = false;
      const source = new Observable<void>((subscriber: Subscriber<void>) => {
        return () => unsubscribed = true;
      });
      source.observeOnScope($scope).subscribe();
      
      $scope.$destroy();
      expect(unsubscribed).to.be.true;
    });

    it('should remove $onDestroy listener when it completes', () => {
      const {$scope} = createScope();
      let removed = false;
      stub($scope, '$on').returns(() => removed = true);
      Observable.empty()
        .observeOnScope($scope)
        .subscribe();
      expect(removed).to.be.true;
    });

    it('should remove $onDestroy listener when it errors', () => {
      const {$scope} = createScope();
      let removed = false;
      stub($scope, '$on').returns(() => removed = true);
      const source = new Subject<void>();
      source
        .observeOnScope($scope)
        .subscribe();
      source.error('some error');
      expect(removed).to.be.true;
    });
  });

});

describe('$scope behaviour', () => {
  it('should apply function synchronously', () => {
    const {$scope} = createScope();
    let applied = false;
    $scope.$apply(() => applied = true);
    expect(applied).to.be.true;
  });

  it('should have its $$phase set to "$apply" in passed lambda to $apply() on itself', () => {
    const {$scope} = createScope();
    let phase: any;
    $scope.$apply(() => phase = $scope.$$phase);
    expect(phase).to.equal('$apply');
  });

  it('should have its $$phase set to "$apply" in passed lambda to $apply() on root', () => {
    const {$scope, $rootScope} = createScope();
    let phase: any;
    $rootScope.$apply(() => phase = $scope.$$phase);
    expect(phase).not.to.be.undefined;
  });

  it('should throw when calling $apply in context of an $apply() call', () => {
    const {$scope, $rootScope} = createScope();
    const shouldThrow = () => $scope.$apply();
    expect(() => $rootScope.$apply(shouldThrow)).to.throw();
  });
});
