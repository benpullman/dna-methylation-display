var userService = angular.module('app.services.user', ['ngResource']);
 
userService.factory('User', ['$resource','$window',
  function($resource,$window){
    return $resource('api/user/:id/:command',{},
    	{
    	 'get': { method: 'GET' },
    	 'getAll': { method: 'GET', isArray: true},
    	 'add': { method: 'POST' }
    	}
    );
  }]);