'use strict';
require('controllers/controllers');
require('controllers/submitController')
require('controllers/userController')
require('controllers/viewController')
require('services/resource');
require('services/user');
require('factories/methylation');
require('filters/markdown');
require('directives/dot');

// Declare app level module which depends on filters, and services
angular.module('app', ['ngRoute','ngCookies','ui.bootstrap',
	'app.controllers','app.submitController','angularFileUpload','app.userController','app.viewController',
	'app.methylation',
	'app.services.resource','app.services.user','markdown','dotDirective']).
config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider) {
  $routeProvider.when('/', {templateUrl: 'partials/welcome.html', controller: 'UserController'});
  $routeProvider.when('/view/:id', {templateUrl: 'partials/main.html', controller: 'MainController'});
  $routeProvider.when('/test', {templateUrl: 'partials/view.html', controller: 'ViewController'});
  $routeProvider.otherwise({redirectTo: '/'});
}]);