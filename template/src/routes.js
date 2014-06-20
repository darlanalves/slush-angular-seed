$module.config(['$stateProvider',
	function($stateProvider) {
		var states = {
			'index': {
				url: '',
				templateUrl: '/home.html',
				controller: 'HomeController'
			}
		};

		angular.forEach(states, function(config, name) {
			$stateProvider.state(name, config);
		});
	}
]);