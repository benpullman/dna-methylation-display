angular.module('app.loadData', []).
factory('loadData', ['Resource', '$q', function(Resource, $q) {
	return{
		load:
			function(){
				return Resource.get().$promise.then(function(result){
					var one = "";
					for(key in result.regions){
				        console.log(key)
				        one = key;
				        break;
				      } //just gets one CpG island: has all samples
				    var allKeys = []
				    for(sample in result.regions[one].samples){
				        allKeys.push(sample)
				    }
					var sampleNames = allKeys
					return {'all':result,'sampleNames':sampleNames}
				});
			}
	}
}]);