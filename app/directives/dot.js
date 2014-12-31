angular.module('dotDirective', [])
	.directive("dot", function() {
  return {
    restrict: "E",
    scope: {
        samples: '='
    },
    templateUrl: 'partials/methylationDot.html',
    replace: true,
    controller: [ '$scope', function ($scope) {
        var getRadius = function(samples){
          if (typeof samples === "undefined" || typeof samples.length === "undefined"){
            return 0;
          } else if (samples.length > 100){
            radius = 100
          } else if (samples.length < 20){
            radius = 20
          } else {
            radius = samples.length
          }
          return radius/4
        };
        var getMethylationLevel = function(data){
        if (typeof data === "undefined"){
            return 0;
        } else if (data.length > 0){
        $scope.excluded = 0
        $scope.included = 0
        for(i=0;i<data.length;i++){
          data[i].alignmentIdentity = (data[i].alignment.end-data[i].alignment.start-data[i].alignment.mismatches-data[i].alignment.gaps)/(data[i].alignment.end-data[i].alignment.start);
          data[i].percentConversion = data[i].methylation.methylated/(data[i].methylation.methylated+data[i].methylation.unmethylated);
          if (data[i].alignmentIdentity > .95){
            data[i].include = true;
            $scope.included += 1;
          }else{
            $scope.excluded += 1;
          }
        };
        var referenceCpGSites = data[0].methylation.reference
        var analyses = data;
        var percentMethylation = generateMethylation(referenceCpGSites,analyses);
        var totalMethylation = 0
        for(var i = 0; i < percentMethylation.length; i++){
          if (percentMethylation[i]['m'] + percentMethylation[i]['u']){
            totalMethylation += percentMethylation[i]['m']/(percentMethylation[i]['m']+percentMethylation[i]['u'])
          }
        }           
        return (totalMethylation/percentMethylation.length);
      }
        return 0
    };
    var generateMethylation = function(refSites,data){
        var methylationSite = []
        for(i=0;i<refSites.length;i++){
            methylationSite[i] = {'location':refSites[i],'m':0,'u':0}
        }
        for(i=0;i<data.length;i++){
            if (data[i].include){
                for (j=0;j<data[i].methylation.sequence.length;j++){
                    if (data[i].methylation.sequence[j] == 'M'){
                        methylationSite[j]['m'] += 1
                    }else if (data[i].methylation.sequence[j] == 'U'){
                        methylationSite[j]['u'] += 1
                    }
                }
            }
        }
        return methylationSite;
    }
        $scope.methylation = getMethylationLevel($scope.samples)
        $scope.radius = getRadius($scope.samples);
    }]
  }
});