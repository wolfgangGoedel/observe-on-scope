import * as ng from 'angular';

interface IData {}

class MyComponentController {
  data: IData;
  
  constructor(private $scope: ng.IScope) {}

  $onInit() {
    fetch('data.json')
    .then(res => res.json() as IData)
    .then(data => {
      this.data = data;
      this.$scope.$apply();
    });
  }
}

export default (app: ng.IModule) => {
  app.component('myModule', {
    controller: MyComponentController,
    template: `<section></section>`
  });
}
