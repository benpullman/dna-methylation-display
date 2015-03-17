//'use strict';
/* Controllers */

angular.module('app.controllers', [])
  .controller('MainController', ['$scope','$routeParams','$filter','loadData','methylation',function($scope,$routeParams,$filter, loadData, methylation) {
    $scope.showAll = true;
    $scope.regions = {}; //dictionary of regions
    $scope.allSamples = []; //list of sampleNames
    // Resource.get({}, function(data){
    //   var one = "";
    //   console.log(data)
    //   for(key in data.regions){
    //     console.log(key)
    //     one = key;
    //     break;
    //   }
    //   var allKeys = []
    //   for(sample in data.regions[one].samples){
    //     allKeys.push(sample)
    //   }
    //   $scope.allSamples = allKeys;
    //   console.log(allKeys)
    //   $scope.regions = data;
    // });
    var load = function(){
      loadData.load().then(function(loaded){
        // console.log(loaded);
        $scope.regions = loaded.all.regions; 
        console.log(loaded.all.regions);
        $scope.allSamples = loaded.sampleNames;
      })
      .catch(function(error){
        alert("error loading methylation data. Please try again")
      });
    };
    load();


    // $scope.getMethylationLevel = function(data){
    //     if (typeof data === "undefined"){
    //         return 0;
    //     } else if (data.length > 0){
    //     $scope.excluded = 0
    //     $scope.included = 0
    //     for(i=0;i<data.length;i++){
    //       data[i].alignmentIdentity = (data[i].alignment.end-data[i].alignment.start-data[i].alignment.mismatches-data[i].alignment.gaps)/(data[i].alignment.end-data[i].alignment.start);
    //       data[i].percentConversion = data[i].methylation.methylated/(data[i].methylation.methylated+data[i].methylation.unmethylated);
    //       if (data[i].alignmentIdentity > .95){
    //         data[i].include = true;
    //         $scope.included += 1;
    //       }else{
    //         $scope.excluded += 1;
    //       }
    //     };
    //     $scope.referenceCpGSites = data[0].methylation.reference
    //     $scope.referenceLength = data[0].referenceLength
    //     $scope.analyses = data;
    //     $scope.percentMethylation = generateMethylation($scope.referenceCpGSites,$scope.analyses);
    //     var totalMethylation = 0
    //     for(var i = 0; i < $scope.percentMethylation.length; i++){
    //       totalMethylation += $scope.percentMethylation[i]['m']/($scope.percentMethylation[i]['m']+$scope.percentMethylation[i]['u'])
    //     }
    //     return (totalMethylation/$scope.percentMethylation.length);
    //   }
    //     return 0
    // };
    $scope.getInfo = function(data){
        $scope.title = data[0].barcode + ": " + data[0].referenceName
        $scope.showAll = false;
        
        if (data.length > 0){
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
        $scope.percentMethylation = generateMethylation($scope.referenceCpGSites,$scope.analyses);
      }
    };
    $scope.backToOverview = function(){
      $scope.showAll = true
    };

    $scope.getTooltip = function(sampleName,sample){
      return "Sample "+sampleName+" for CpG island "+sample.analyses[0].referenceName+"\nRead Depth: "+sample.analyses.length+
      "\nAverage Methylation Level: "+$filter('number')(methylation.getMethylationLevel(sample.analyses).methylationLevel, 4);
    }
  	/*Resource.get(
  		{},
  		function(data){
  			$scope.excluded = 0
  			$scope.included = 0
  			for(i=0;i<data.length;i++){
  				data[i].alignmentIdentity = (data[i].alignment.length-data[i].alignment.mismatches)/data[i].alignment.length;
  				data[i].percentConversion = data[i].bisulfite.convertedCpH/(data[i].bisulfite.unconvertedCpH+data[i].bisulfite.convertedCpH);
  				if (data[i].alignmentIdentity > .95 && data[i].percentConversion > .75){
  					data[i].include = true;
  					$scope.included += 1;
  				}else{
  					$scope.excluded += 1;
  				}
  			}
  			$scope.referenceCpGSites = data[0].methylation.reference
  			$scope.referenceLength = data[0].referenceLength
  			$scope.analyses = data;
  			$scope.percentMethylation = generateMethylation($scope.referenceCpGSites,$scope.analyses);
  	});*/
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
      console.log("list of methylation?")
      console.log(methylationSite)
  		return methylationSite;
  	}
  	$scope.percentMethylation = [];
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
  	
    $scope.predicate = '1-(methylation.methylatedCpGSites/(methylation.methylatedCpGSites+methylation.cpGSites))'
  	$scope.includePredicate = 'include'
      //code here
  }]);