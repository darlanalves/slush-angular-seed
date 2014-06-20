describe('FooService', function() {
	beforeEach(module('app-mock'));

	describe('getFoo()', function() {
		it('should return foo from `/foo` URL', inject(function($httpBackend, FooService, $rootScope) {
			var FOO = 'foo',
				response;

			runs(function() {

				$httpBackend.whenGET('/foo').respond(200, FOO);

				FooService.getFoo().then(function(foo) {
					response = foo;
				});

				$httpBackend.flush();
			});

			waitsFor(function() {
				return response;
			}, 'the response', 100);

			runs(function() {
				expect(response).toBe(FOO);
			});
		}));
	});
});