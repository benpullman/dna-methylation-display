angular.module('app.viewController', ['base64'])
  .controller('ViewController', ['$scope','$routeParams', '$location','loadData',function($scope,$routeParams, $location, loadData) {
    var routeName = $routeParams.sample.split('--')
    $scope.routeName = routeName
    var sampleName = routeName[0]
    $scope.summaryName = sampleName
    var regionName = routeName[1]
    $scope.regionName = regionName
    console.log(regionName)
    var load = function(){
      loadData.load().then(function(loaded){
        // console.log(loaded);
        $scope.regions = loaded.all.regions; 
        console.log(loaded.all.regions);
        $scope.allSamples = loaded.sampleNames;
        var data = $scope.regions[regionName].samples[sampleName].analyses
        $scope.excluded = 0
        $scope.included = 0
        for(i=0;i<data.length;i++){
          data[i].alignmentIdentity = (data[i].alignment.end-data[i].alignment.start-data[i].alignment.mismatches-data[i].alignment.gaps)/(data[i].alignment.end-data[i].alignment.start);
          data[i].percentConversion = data[i].methylation.methylated/(data[i].methylation.methylated+data[i].methylation.unmethylated);
          if (data[i].alignmentIdentity > $scope.identityCutoff){
            data[i].include = true;
            $scope.included += 1;
          }else{
            $scope.excluded += 1;
          }
        };
        $scope.referenceCpGSites = data[0].methylation.reference
        $scope.referenceLength = data[0].referenceLength
        $scope.analyses = data; 
        // $scope.percentMethylation = generateMethylation($scope.referenceCpGSites,$scope.analyses);
        $scope.methylationChart = generateMethylation($scope.referenceCpGSites, $scope.analyses);
        console.log($scope.methylationChart)
      })
      .catch(function(error){
        alert("error loading methylation data. Please try again")
      });
    };

    var generateMethylation = function(refSites,data){
  		var methylationSite = []
  		for(i=0;i<refSites.length;i++){
  			methylationSite[i] = {'x':refSites[i],'meth':50}
  		}

      console.log("list of methylation?")
  		return methylationSite;
  	}

    load();

    $scope.backToOverview = function(){
      $location.path('view/'+$routeParams.id)
    };

    $scope.identityCutoff = .95;
    $scope.title = sampleName + ":" + regionName

    $scope.setMethylation = function(include){
  		$scope.percentMethylation = generateMethylation($scope.referenceCpGSites,$scope.analyses);
      if(include){
        $scope.included += 1
        $scope.excluded -= 1
      }
      else{
        $scope.excluded += 1
        $scope.included -= 1
      }
  	}
        
        // if (data.length > 0){
        // $scope.excluded = 0
        // $scope.included = 0
        // for(i=0;i<data.length;i++){
        //   data[i].alignmentIdentity = (data[i].alignment.end-data[i].alignment.start-data[i].alignment.mismatches-data[i].alignment.gaps)/(data[i].alignment.end-data[i].alignment.start);
        //   data[i].percentConversion = data[i].methylation.methylated/(data[i].methylation.methylated+data[i].methylation.unmethylated);
        //   if (data[i].alignmentIdentity > $scope.identityCutoff){
        //     data[i].include = true;
        //     $scope.included += 1;
        //   }else{
        //     $scope.excluded += 1;
        //   }
        // };
        // $scope.referenceCpGSites = data[0].methylation.reference
        // $scope.referenceLength = data[0].referenceLength
        // $scope.analyses = data; 
        // // $scope.percentMethylation = generateMethylation($scope.referenceCpGSites,$scope.analyses);
        // $scope.methylationChart = generateMethylation($scope.referenceCpGSites, $scope.analyses);
    // }


}]);