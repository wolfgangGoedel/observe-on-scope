import * as ng from 'angular';
import 'isomorphic-fetch';
import { Observable, Subscription } from 'rxjs';

interface IData {}

class MyComponentController {
  data: IData;
  dataSubscription: Subscription;

  constructor(private $scope: ng.IScope) {}

  $onInit() {
    const data$ = Observable.fromPromise(
      fetch('data.json')
      .then(res => res.json() as IData)
    );
    this.dataSubscription = data$.subscribe(data => {
      this.data = data;
      this.$scope.$apply();
    });
  }

  $onDestroy() {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }
}

export default (app: ng.IModule) => {
  app.component('myModule', {
    controller: MyComponentController,
    template: `<section></section>`
  });
}
