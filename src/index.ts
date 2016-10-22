import { Observable } from 'rxjs/Observable';
import { observeOnScope, ObserveOnScopeSignature } from './observeOnScope';

Observable.prototype.observeOnScope = observeOnScope;

declare module "rxjs/Observable" {
  interface Observable<T> {
    observeOnScope: ObserveOnScopeSignature<T>;
  }
}