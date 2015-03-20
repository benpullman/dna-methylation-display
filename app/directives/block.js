angular.module('blockDirective', [])
	.directive("block", function() {
  return {
    restrict: "E",
    scope: {
        samples: '=',
        identityCutoff: '='
    },
    templateUrl: 'partials/methylationBlock.html',
    replace: true,
    controller: [ '$scope','methylation', function ($scope, methylation) {
        $scope.methylation = methylation.getMethylationLevel($scope.samples, $scope.identityCutoff).methylationLevel
        $scope.included = methylation.getMethylationLevel($scope.samples, $scope.identityCutoff).included
        $scope.excluded = methylation.getMethylationLevel($scope.samples, $scope.identityCUtoff).excluded
    }]
  }
});