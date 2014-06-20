$module.factory('FooService', ['$http',
	function($http) {
		return {
			getFoo: function() {
				return $http.get('/foo').then(function(response) {
					return response.data;
				});
			}
		};
	}
]);