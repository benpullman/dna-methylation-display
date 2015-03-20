//'use strict';
/* Controllers */

angular.module('app.controllers', [])
  .controller('MainController', ['$scope','$routeParams','$filter','loadData','methylation', '$modal', '$sce', function($scope,$routeParams,$filter, loadData, methylation, $modal, $sce) {
    $scope.showAll = true;
    $scope.regions = {}; //dictionary of regions
    $scope.allSamples = []; //list of sampleNames

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

    $scope.getTooltip = function(sampleName,sample){
      return "Sample "+sampleName+" for CpG island "+sample.analyses[0].referenceName+"\nRead Depth: "+sample.analyses.length+
      "\nAverage Methylation Level: "+$filter('number')(methylation.getMethylationLevel(sample.analyses).methylationLevel, 4);
    }

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

    $scope.changeName = function(regions, regex){
      // var sampleFormat = Object.getKeys(regions)
      console.log(regions)
      for(first in regions) break;
        console.log(first)
      var sample = regions[first]['samples']
      for (phirst in sample) break;
      var sampleFormat = sample[phirst]['analyses'][0]['sampleName']
      $modal.open({
        templateUrl: 'partials/modal/regexName.html',
        size: 'md',
        resolve: {
        sampleFormat: function (){
            return sampleFormat;
          },
        regex: function(){
          return regex;
          }
        },
        controller: ['$scope', '$modalInstance', 'sampleFormat', 'regex', function($scope, $modalInstance, sampleFormat, regex){
          $scope.sampleFormat = sampleFormat
          if(typeof regex == 'undefined') regex = '/([^/]+)/';
          $scope.regex = regex

          $scope.deliberatelyTrustDangerousSnippet = function() {
            var filtered = $filter('nameExp')(sampleFormat,$scope.regex);
            var bold = new RegExp('(' + filtered + ')', 'i');
            $scope.sampleFormat = sampleFormat.replace(bold, '<span style="background-color:yellow">$1</span>');
               return $sce.trustAsHtml($scope.sampleFormat);
             };

          $scope.change = function(){
            console.log("submit")
            // console.log($parentScope)
            console.log($scope)
            changeRegex($scope.regex)

          };
        }]
      });
    };

    var changeRegex = function(regex){
      console.log("changed!")
      console.log(regex)
      $scope.regex = regex
    }

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