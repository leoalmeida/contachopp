/* global angular,window */

var dashboardDbApp = angular.module('dashboardDbApp', ['ui.bootstrap', 'ngTouch', 'ngRoute', 'ngResource', 'ngAnimate', 'dashboardDbControllers', 'dashboardFilters']);

dashboardDbApp.config(['$routeProvider', '$locationProvider', 
	function($routeProvider ,$locationProvider)
	{			
		$routeProvider.
			when('/', {
				//templateUrl: 'partials/index.html',
				controller: 'DashboardCtrl'			
			}).
			when('/dashboard', {  
				//templateUrl: 'partials/home.html',
				controller: 'DashboardCtrl'			
			}).						
			when('/unsupported', {
				templateUrl: 'partials/unsupported.html'
			}).
			otherwise({
				redirectTo: '/'
			});
			
		$locationProvider.html5Mode(true).hashPrefix('!');
		
	}
]);

