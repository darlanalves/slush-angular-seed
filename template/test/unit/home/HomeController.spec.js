describe('HomeController', function() {
	var $controller, $scope, controller = 'HomeController';

	beforeEach(module('app-mock'));
	beforeEach(inject(function($rootScope, _$controller_) {
		$controller = _$controller_;
		$scope = $rootScope.$new();
	}));

	describe('when the controller runs', function() {
		it('should set $scope.awesome to `true`', function() {
			$controller(controller, {
				$scope: $scope
			});

			expect($scope.awesome).toBe(true);
		});

		it('should set $scope.foo to whatever came from service', inject(function($httpBackend, $q) {

			var defer, FOO = 'foo';

			var FooService = {
				getFoo: function() {
					defer = $q.defer();
					return defer.promise;
				}
			}

			$httpBackend.whenGET('/foo').respond(200, FOO);

			$controller(controller, {
				$scope: $scope,
				FooService: FooService
			});

			defer.resolve(FOO);
			$scope.$root.$digest();
			expect($scope.foo).toBe(FOO);
		}));
	});
});