var resourceServices = angular.module('app.services.resource', ['ngResource']);
 
resourceServices.factory('Resource', ['$resource','$window',
  function($resource,$window){
    return $resource('/api/results/:id',{}, 
    	//return $resource('api/view/:id',{}, 
    	{
    	 'get': { method: 'GET'},
    	 'add': { method: 'POST'}
    	}
     );
  }]);