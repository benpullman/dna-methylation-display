//'use strict';
/* Controllers */

angular.module('app.controllers', [])
  .controller('MainController', ['$scope','$routeParams','$filter','loadData','methylation', '$modal', '$sce', 'setter', function($scope,$routeParams,$filter, loadData, methylation, $modal, $sce, setter) {
    $scope.showAll = true;
    $scope.regions = {}; //dictionary of regions
    $scope.allSamples = []; //list of sampleNames
    $scope.identityCutoff = setter.getCutoff() ? setter.getCutoff() : .90;
    $scope.regex = setter.getRegex() //leave undefined

    var load = function(){
          // console.log("id is "+$routeParams.id) //pass in eventually
      loadData.load($routeParams.id).then(function(loaded){

        // console.log(loaded);
        $scope.regions = loaded.all.regions; 
        console.log(loaded.all.regions);
        $scope.allSamples = loaded.sampleNames;
        setter.setMethylation(loaded)
      })
      .catch(function(error){
        alert("error loading methylation data. Please try again")
      });
    };
    load();

    $scope.link = function(sampleName,region){
      // console.log(sampleName)
      return "#/view/"+$routeParams.id+"/sample/"+sampleName+"--"+region
    }

    $scope.getInfo = function(data){
        $scope.title = data[0].barcode + ":" + data[0].referenceName
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
        // $scope.percentMethylation = generateMethylation($scope.referenceCpGSites,$scope.analyses);
        $scope.methylationChart = generateMethylation($scope.referenceCpGSites, $scope.analyses);
      }
    };

    $scope.getTooltip = function(sampleName,sample){
      return "Sample "+sampleName+" for CpG island "+sample.analyses[0].referenceName+"\nRead Depth: "+sample.analyses.length+
      "\nAverage Methylation Level: "+$filter('number')(methylation.getMethylationLevel(sample.analyses).methylationLevel, 4);
    }

  	var generateMethylation = function(refSites,data){
  		var methylationSite = []
  		for(i=0;i<refSites.length;i++){
  			methylationSite[i] = {'x':refSites[i],'meth':50}
  		}

    //   console.log(data)
  		// for(i=0;i<data.length;i++){
  		// 	if (data[i].include){
  		// 		for (j=0;j<data[i].methylation.sequence.length;j++){
  		// 			if (data[i].methylation.sequence[j] == 'M'){
  		// 				methylationSite[j]['m'] += 1
  		// 			}else if (data[i].methylation.sequence[j] == 'U'){
  		// 				methylationSite[j]['u'] += 1
  		// 			}
  		// 		}
  		// 	}
  		// }
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
            changeRegex($scope.regex);
            $modalInstance.close();

          };
        }]
      });
    };

    var changeRegex = function(regex){
      console.log("changed!")
      console.log(regex)
      $scope.regex = regex
      setter.setRegex(regex)
    }

    $scope.setIdentityCutoff = function(){
      setter.setCutoff($scope.identityCutoff)
      console.log("setter")
    }
  	
    $scope.predicate = '1-(methylation.methylatedCpGSites/(methylation.methylatedCpGSites+methylation.cpGSites))'
  	$scope.includePredicate = 'include'
      //code here
  }]);