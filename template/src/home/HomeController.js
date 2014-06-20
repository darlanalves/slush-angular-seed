$module.controller('HomeController', ['$scope', 'FooService',
	function($scope, FooService) {
		$scope.awesome = true;

		FooService.getFoo().then(function(foo) {
			$scope.foo = foo;
		});
	}
]);