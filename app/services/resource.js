var resourceServices = angular.module('app.services.resource', ['ngResource']);
 
resourceServices.factory('Resource', ['$resource','$window',
  function($resource,$window){
    return $resource('data.json',{},
    	{
    	 'get': { method: 'GET' }
    	     	}
    );
  }]);