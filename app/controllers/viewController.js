angular.module('app.viewController', [])
  .controller('ViewController', ['$scope','Resource',function($scope,Resource) {
    $scope.showAll = true;
    //$scope.regions = Resource.get({id: $routeParams['id']})
    $scope.regions = Resource.get({})
}]);