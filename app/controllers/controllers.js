//'use strict';
/* Controllers */

angular.module('app.controllers', [])
  .controller('MainController', ['$scope','Resource',function($scope,Resource) {
    $scope.regions = Resource.get({})
    $scope.getInfo = function(data){
        if (data.length > 0){
        $('#infoModal').modal('show');
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
      }
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
  		return methylationSite;
  	}
  	$scope.percentMethylation = [];
  	$scope.setMethylation = function(){
  		$scope.percentMethylation = generateMethylation($scope.referenceCpGSites,$scope.analyses);
  	}
  	$scope.predicate = '1-(methylation.methylatedCpGSites/(methylation.methylatedCpGSites+methylation.cpGSites))'
  	$scope.includePredicate = 'include'
      //code here
  }]);