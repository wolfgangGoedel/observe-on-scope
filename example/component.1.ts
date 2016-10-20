import * as ng from 'angular';
import 'isomorphic-fetch';

interface IData {}

class MyComponentController {
  data: IData;
  stillInterested = true;

  constructor(private $scope: ng.IScope) {}

  $onInit() {
    fetch('data.json')
    .then(res => res.json() as IData)
    .then(data => {
      if (this.stillInterested) {
        this.data = data;
        this.$scope.$apply();
      }
    });
  }

  $onDestroy() {
    this.stillInterested = false;
  }
}

export default (app: ng.IModule) => {
  app.component('myModule', {
    controller: MyComponentController,
    template: `<section></section>`
  });
}
