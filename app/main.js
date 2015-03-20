'use strict';
require('controllers/controllers');
require('controllers/submitController');
require('controllers/userController');
require('controllers/viewController');
require('controllers/testController');
require('services/resource');
require('services/user');
require('factories/methylation');
require('factories/loadData');
require('filters/nameExp');
require('filters/markdown');
require('directives/dot');
require('directives/block');

// Declare app level module which depends on filters, and services
angular.module('app', ['ngRoute','ngCookies','ui.bootstrap',
	'app.controllers','app.submitController','angularFileUpload','app.userController','app.viewController',
	'app.testController',
	'app.methylation', 'app.loadData',
	'app.services.resource','app.services.user','nameExp','markdown','dotDirective','blockDirective']).
config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider) {
  $routeProvider.when('/', {templateUrl: 'partials/welcome.html', controller: 'UserController'});
  $routeProvider.when('/view/:id', {templateUrl: 'partials/main.html', controller: 'MainController'});
  $routeProvider.when('/test', {templateUrl: 'partials/view.html', controller: 'ViewController'});
  $routeProvider.when('/testing', {templateUrl: 'partials/timeline.html', controller: 'TestController'});
  $routeProvider.otherwise({redirectTo: '/'});
}]);