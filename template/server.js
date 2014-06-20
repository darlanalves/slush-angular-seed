var express = require('express'),
	router = express.Router(),
	app = express();

app.use(router).use(express.static('public'));

var server = app.listen(process.env.PORT || 8000, function() {
	console.log('Listening on port %d', server.address().port);
});