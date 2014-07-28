'use strict';
require('controllers/controllers');
require('services/resource');
require('filters/markdown');


// Declare app level module which depends on filters, and services
angular.module('app', ['ngRoute','ngCookies','app.controllers','app.services.resource','ui.bootstrap.datetimepicker','markdown']).
config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider) {
  $routeProvider.when('/', {templateUrl: 'partials/main.html', controller: 'MainController'});
  $routeProvider.otherwise({redirectTo: '/'});
}]);