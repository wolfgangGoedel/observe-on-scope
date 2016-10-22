import { IScope } from 'angular';

export function safeApplyOnScope($scope: IScope) {
  return (fn: () => void) => {
    if ($scope.$$phase || ($scope.$root && $scope.$root.$$phase)) {
      fn();
    } else {
      $scope.$apply(fn);
    }
  }
}