angular.module('dotDirective', [])
	.directive("dot", function() {
  return {
    restrict: "E",
    scope: {
        samples: '='
    },
    templateUrl: 'partials/methylationDot.html',
    replace: true,
    controller: [ '$scope','methylation', function ($scope, methylation) {
        var getRadius = function(samples){
          console.log(samples)
          if (typeof samples === "undefined" || typeof samples.length === "undefined"){
            return 0;
          } else if (samples.length > 100){
            radius = 100
          } else if (samples.length < 20){
            radius = 20
          } else {
            radius = samples.length
          }
          console.log(radius)

          return radius/4
        };
        $scope.methylation = methylation.getMethylationLevel($scope.samples).methylationLevel
        $scope.included = methylation.getMethylationLevel($scope.samples).included
        $scope.excluded = methylation.getMethylationLevel($scope.samples).excluded
        $scope.radius = getRadius($scope.samples);
    }]
  }
});