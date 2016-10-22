import { Observable } from 'rxjs/Observable';
import { Operator } from 'rxjs/Operator';
import { Subscriber } from 'rxjs/Subscriber';
import { TeardownLogic } from 'rxjs/Subscription';
import { IScope } from 'angular';
import { safeApplyOnScope } from './safeApplyOnScope';


export function observeOnScope<T>(this: Observable<T>, $scope: IScope): Observable<T> {
  return this.lift<T>(createOperator($scope));
}

export interface ObserveOnScopeSignature<T> {
  ($scope: IScope): Observable<T>;
}

const createOperator = <T>($scope: IScope) => (
  function(this: Subscriber<T>, source: any) {
    return source._subscribe(new ObserveOnScopeSubscriber(this, $scope));
  } as Operator<T, T>
);

class ObserveOnScopeSubscriber<T> extends Subscriber<T> {
  private _safeApply: (fn: () => void) => void;
  private _unregister: () => void;

  constructor(destination: Subscriber<T>, $scope: IScope) {
    super(destination);
    
    this._safeApply = safeApplyOnScope($scope);
    
    this._unregister = $scope.$on('$destroy', () => {
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
    this._unregister();
  }

  protected _complete(): void {
    this._safeApply(() => this.destination.complete());
    this._unregister();
  }
}
