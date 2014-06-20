$module.run(function($httpBackend) {
	$httpBackend.whenGET('/foo').respond(200);
});