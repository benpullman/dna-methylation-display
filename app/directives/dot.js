angular.module('dotDirective', [])
	.directive("dot", function() {
  return {
    restrict: "E",
    scope: {
        samples: '=',
        identityCutoff: '='
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
          // console.log(radius)

          return radius/4
        };
        $scope.$watch('identityCutoff', function(newVal, oldVal){
          if (newVal !== oldVal) {
            $scope.methylation = methylation.getMethylationLevel($scope.samples, newVal).methylationLevel
            $scope.included = methylation.getMethylationLevel($scope.samples, newVal).included
            $scope.excluded = methylation.getMethylationLevel($scope.samples, newVal).excluded
            $scope.radius = getRadius($scope.samples);
            console.log("I got the new value! ", newVal);
          }
      }, true);
        $scope.$watch('methylation', function(newVal, oldVal){
          // if(newVal !== oldVal){
            console.log("new methylation")
          // }
        }, true);
        
    }]
  }
});