import { Observable } from 'rxjs/Observable';
import { Operator } from 'rxjs/Operator';
import { Subscriber } from 'rxjs/Subscriber';
import { TeardownLogic } from 'rxjs/Subscription';
import { IScope } from 'angular';

export function observeOnScope<T>(this: Observable<T>, $scope: IScope): Observable<T> {
  return this.lift<T>(operator);

  function operator(this: Subscriber<T>, source: any) {
    return source._subscribe(new ObserveOnScopeSubscriber(this, $scope));
  };
}

export interface ObserveOnScopeSignature<T> {
  ($scope: IScope): Observable<T>;
}

class ObserveOnScopeSubscriber<T> extends Subscriber<T> {
  private _safeApply: (fn: () => void) => void;

  constructor(destination: Subscriber<T>, $scope: IScope) {
    super(destination);
    
    this._safeApply = safeApplyOnScope($scope);
    
    $scope.$on('$destroy', () => {
      this._complete();
      this.unsubscribe();
      this._safeApply = undefined;
    });
  }

  protected _next(value: T): void {
    this._safeApply(() => this.destination.next(value));
  }

  protected _error(err: any): void {
    this._safeApply(() => this.destination.error(err));
  }

  protected _complete(): void {
    this._safeApply(() => this.destination.complete());
  }
}

function safeApplyOnScope($scope: IScope) {
  return (fn: () => void) => {
    if ($scope.$$phase || ($scope.$root && $scope.$root.$$phase)) {
      fn();
    } else {
      $scope.$apply(fn);
    }
  }
}