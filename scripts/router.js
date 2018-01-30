'use strict';

var MYapp = angular.module('restaurant',['ngFileUpload','angular-web-notification','pusher-angular','ui.bootstrap','chart.js','ngSanitize', 'ui.select','uiSwitch','ngResource','ngRoute','ngCookies','toastr','angular-loading-bar','ngDialog','thatisuday.dropzone'])
	.config(function($routeProvider){
		$routeProvider
		.when('/',{
			templateUrl:'views/login.html',
			controller: 'LoginCtrl'
		})
		.when('/home',{
			templateUrl:'views/home/index.html',
			controller: 'IndexHomeCtrl'
		})
		.when('/users',{
			templateUrl:'views/users/index.html',
			controller: 'UsersCtrl'
		})
		.when('/notificaciones',{
			templateUrl: 'views/notification/index.html',
			controller: 'NotificationCtrl'
		})
		.when('/categories',{
			templateUrl: 'views/categories/index.html',
			controller: 'CategoriesCtrl'
		})
		.when('/multimedia',{
			templateUrl: 'views/multimedia/index.html',
			controller: 'MultimediaCtrl',
			controllerAs: 'ctrl'
		})
		.when('/clases',{
			templateUrl: 'views/clases/index.html',
			controller: 'ClasesCtrl'
		})
		.when('/products',{
			templateUrl:'views/products/index.html',
			controller: 'IndexProductCtrl'
		})
		.when('/tables',{
			templateUrl:'views/tables/index.html',
			controller: 'IndexTablesCtrl'
		})
		.when('/orders',{
			templateUrl:'views/orders/index.html',
			controller: 'IndexOrdersCtrl'
		})
		.when('/orders/:id',{
			templateUrl:'views/orders/single.html',
			controller: 'IndexOrdersSingleCtrl'
		})
		.when('/report',{
			templateUrl:'views/report/index.html',
			controller: 'IndexReportCtrl'
		})
		.when('/panel',{
			templateUrl:'views/panel/index.html',
			controller: 'IndexPanelCtrl'
		})
	});
