import * as ng from 'angular';
import 'isomorphic-fetch';
import { Observable, Subscription, Subject } from 'rxjs';

interface IData {
  message: string;
}

class MyComponentController {
  data: IData;
  cancel$ = new Subject<IData>();

  constructor(private $scope: ng.IScope) {}

  $onInit() {
    Observable.race<IData>(
      Observable.fromPromise(
        fetch('data.json')
        .then<IData>(res => res.json())
      ),
      this.cancel$
    )
    .observeOnScope(this.$scope)
    .subscribe(data => {
      this.data = data;
    });
  }

  cancelLoad() {
    this.cancel$.next({message: 'canceled'});
  }
}

export default (app: ng.IModule) => {
  app.component('myModule', {
    controller: MyComponentController,
    template: `<section></section>`
  });
}
