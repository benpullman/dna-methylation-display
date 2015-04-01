angular.module('app.viewController', ['base64'])
  .controller('ViewController', ['$scope','$routeParams', '$location','loadData','$modal', 'setter', function($scope,$routeParams, $location, loadData, $modal, setter) {
    var routeName = $routeParams.sample.split('--')
    $scope.routeName = routeName
    var sampleName = routeName[0]
    $scope.summaryName = sampleName
    var regionName = routeName[1]
    $scope.regionName = regionName
    console.log(regionName)
    $scope.view = 'true'

    $scope.identityCutoff = setter.getCutoff() ? setter.getCutoff() : .95
    $scope.regex = setter.getRegex() ? setter.getRegex() : "(.*)"

    var loaded = setter.getMethylation();
    console.log(loaded)

    if(typeof loaded == 'undefined' || !loaded){
    	console.log("loading into memory")
          	runLoad();
      }
      else{
      	console.log("got from memory")
      	format(loaded);
      }

     $scope.testing = function(view){
     	console.log(view)
     	console.log(typeof view)
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
        console.log("let's go")
    }

    function generateMethylation(refSites,data){
  		var methChart = []
  		var methylationSite = []
  		for(i=0;i<refSites.length;i++){
  			methylationSite[i] = {'m': 0, 'u':0}
  		}

    //   console.log("list of methylation?")
  		// return methylationSite;
  		// console.log(data)
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

  		for(i=0; i<refSites.length;i++){
            var denom = 0;
            var num = 0;
            if(methylationSite[i]['m']+methylationSite[i]['u'] == 0){
              denom = 1
            }
            else{
              denom = methylationSite[i]['m']+methylationSite[i]['u']
            }

            num = methylationSite[i]['m']

            methChart[i] = {'x': refSites[i], 'meth':num/denom * 100, 'mRatio': num + '/' + (methylationSite[i]['m']+methylationSite[i]['u'])}
          }

  		console.log(methChart)
        return methChart
  	}

    $scope.backToOverview = function(){
      $location.path('view/'+$routeParams.id)
    };
    $scope.title = sampleName + ":" + regionName

    $scope.setMethylation = function(include){
  		$scope.methylationChart = generateMethylation($scope.referenceCpGSites,$scope.analyses);
      console.log("now is "+include)
      if(include){
        $scope.included += 1
        $scope.excluded -= 1
      }
      else{
        $scope.excluded += 1
        $scope.included -= 1
      }
  	}

    $scope.moreInfo = function(read){
      $modal.open({
        templateUrl: 'partials/modal/sampleMoreInfo.html',
        size: 'md',
        resolve: {
          read: function() {
            return read;
          }
        },
        controller: ['$scope', '$modalInstance', 'read', function($scope, $modalInstance, read){
          $scope.read = read;
          console.log($scope.read)
        }]
      });
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
        templateUrl: 'partials/modal/r.html',
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