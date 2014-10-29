
var outlinerServices = angular.module('outlinerServices', ['ngResource']);
outlinerServices.factory('Section', ['$resource',
	function($resource) {
		return $resource('http://127.0.0.1:3000/sections/:id', { id: '@id' }, {
			query: { method: 'GET', params: { }, isArray: true, transformResponse: function(data, headersGetter) {
				return angular.fromJson(data);
			}},
			update: { method: 'PUT' }
		});
	}]);

