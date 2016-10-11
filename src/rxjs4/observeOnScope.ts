import { Observable } from 'rx';
import { IScope } from 'angular';

function observeOnScope<T>(this: Observable<T>, $scope: IScope): Observable<T> {
  return Observable.create<T>(observer => {
    const disposable = this.subscribe(
      value => { observer.onNext(value); $scope.$apply() },
      error => { observer.onError(error); $scope.$apply() },
      () => { observer.onCompleted(); $scope.$apply() }
    );
    return disposable;
  });
}

const ObservableType: Function = <any>Observable;
ObservableType.prototype.observeOnScope = observeOnScope;

declare module "rx" {
  interface Observable<T> {
    observeOnScope($scope: IScope): Observable<T>
  }
}
