/*global define*/
'use strict';


angular.module('outliner', ['ngRoute', 'outlinerServices', 'ui.tree'])
	.config(function ($routeProvider) {

		$routeProvider.when('/', {
			controller: 'OutlineController',
			templateUrl: 'templates/outline.html'
		});

	});

