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
          // console.log(samples)
          if (typeof samples === "undefined" || typeof samples.length === "undefined"){
            return 0;
          } else if (samples.length > 100){
            radius = 100
          } else if (samples.length < 8){
            radius = 8
          } else {
            radius = samples.length
          }
          // console.log(radius)

          return radius/8
        };
        $scope.$watch('identityCutoff', function(newVal, oldVal){
          if (newVal !== oldVal) {
            console.log("I got the new value! ", newVal);
          }
      }, true);
        $scope.$watch('methylation', function(newVal, oldVal){
          // if(newVal !== oldVal){
            console.log("new methylation")
          // }
        }, true);

            $scope.methylation = methylation.getMethylationLevel($scope.samples, $scope.identityCutoff).methylationLevel
            $scope.included = methylation.getMethylationLevel($scope.samples, $scope.identityCutoff).included
            $scope.excluded = methylation.getMethylationLevel($scope.samples, $scope.identityCutoff).excluded
            $scope.radius = getRadius($scope.samples);
        
    }]
  }
});