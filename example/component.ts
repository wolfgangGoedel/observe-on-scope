import * as ng from 'angular';
import { Observable, Subject } from 'rxjs';
import '../dist/cjs';

class MyComponentController {
  current: string;
  startStop = new Subject<boolean>();
  started = false;
  
  constructor($scope: ng.IScope) {
    const interval = Observable.interval(100)
    this.startStop
    .switchMap(run => run ? interval : Observable.never())
    .map(_ => new Date().toISOString())
    .observeOnScope($scope)
    .subscribe(
      time => this.current = time
    );
  }

  toggle() {
    this.started = !this.started;
    this.startStop.next(this.started);
  }
}

export default (app: ng.IModule) => {
  app.component('appRoot', {
    controller: MyComponentController,
    template: `
      <section>
        <button ng-click="$ctrl.toggle()">{{$ctrl.started ? 'stop' : 'start'}}</button>
        <pre>{{$ctrl.current | json}}</pre>
      </section>
    `
  });
}
