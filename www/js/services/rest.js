
var outlinerServices = angular.module('outlinerServices', ['ngResource']);
outlinerServices.factory('Outline', ['$resource',
	function($resource) {
		return $resource('http://outliner-rails.herokuapp.com/outlines/:id', { id: '@id' }, {
			query: { method: 'GET', params: { }, isArray: true, transformResponse: function(data, headersGetter) {
				return angular.fromJson(data);
			}},
			update: { method: 'PUT' }
		});
	}]);

