angular.module('app.viewController', ['base64'])
  .controller('ViewController', ['$scope','$routeParams', '$location','loadData','$modal', 'setter', function($scope,$routeParams, $location, loadData, $modal, setter) {
    var routeName = $routeParams.sample.split('--')
    $scope.routeName = routeName
    var sampleName = routeName[0]
    $scope.summaryName = sampleName
    var regionName = routeName[1]
    $scope.regionName = regionName
    console.log(regionName)

    $scope.identityCutoff = setter.getCutoff()
    console.log("after getting, identity cutoff is "+$scope.identityCutoff)
    $scope.regex = setter.getRegex()

    var loaded = setter.getMethylation();
    console.log(loaded)

    if(typeof loaded == 'undefined' || !loaded){
    	console.log("loading into memory")
          	runLoad();
      }
      else{
      	format(loaded);
      }

    function runLoad(){

    	loadData.load().then(function(loaded){
    		format(loaded);
    	});

    };

    function format(loaded){
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
    }

    function generateMethylation(refSites,data){
  		var methylationSite = []
  		for(i=0;i<refSites.length;i++){
  			methylationSite[i] = {'x':refSites[i],'meth':50}
  		}

      console.log("list of methylation?")
  		return methylationSite;
  	}

    $scope.backToOverview = function(){
      $location.path('view/'+$routeParams.id)
    };
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

  	$scope.python = function(sample){
      $modal.open({
        templateUrl: 'partials/modal/python.html',
        size: 'md',
        controller: ['$scope', '$modalInstance', function($scope, $modalInstance){
          $scope.change = function(){
            console.log("submitted")
          };
        }]
      });

    }

    $scope.r = function(sample){
      $modal.open({
        templateUrl: 'partials/modal/python.html',
        size: 'md',
        controller: ['$scope', '$modalInstance', function($scope, $modalInstance){
          $scope.change = function(){
            console.log("submitted")
          };
        }]
      });

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