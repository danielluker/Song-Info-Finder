// 
var express = require('express');
var app = express(); 

// Setting the routing
app.get('/js/discogs_query', function(req, res, next) {
	res.header('Access-Control-Allow-Origin', "*");
	res.sendfile(path.resolve('../index.html'));
	next();
});


// Starting the server
var server = app.listen(8001, function() {
		var host = server.address().address;
		var port = server.address().port;
		console.log('example app listening at http://%s:%s', host, port);
});

function findEntry() {
	var db = new Discogs().setConfig({outputFormat: 'html'});
	db = db.database();
	db.release(176126, function(err, data){
		console.log(data);
	});
}

