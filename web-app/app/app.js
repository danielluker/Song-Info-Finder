'use strict';

// 
var express = require('express');
var app = express(); 
var path = require('path');
var Discogs = require('disconnect').Client;
var finished = false;

// Setting the routing
app.get('/', function(req, res, next) {
	res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/query', function(req, res) {
	// res.set('Content-Type', 'plaintext');
	console.log('Received query', req.query['query']);
	var searchQuery = JSON.parse(req.query['query']);
	findEntry(searchQuery, function(result) {
		res.send(result);
	});
	console.log("finished get method");
})

app.use(express.static(__dirname));
// app.use(express.static(__dirname + 'styles'));

// Starting the server
var server = app.listen(8000, function() {
	var host = server.address().address;
	var port = server.address().port;
	console.log('example app listening at http://%s:%s', host, port);
});


/***
 * Function to prepare the query 
 */
function prepareQuery(song) {
	var params = {
		'type': 'release',
		'artist': song.artist,
		'year': song.year
	}
	return params;
}


/***
 * Function to query the discogs database
 */
function findEntry(query, callback) {
	var result = "<h3>None</h3>";
	var db = new Discogs({userToken:"LDCLVKhiodWTTnuZyAIVCBSZkrhcaauGhobLlYbX"}).setConfig({outputFormat: 'html'});
	db = db.database();
	console.log('Querying the discogs databse for', query);
	db.search(query.title, prepareQuery(query), function(err, data){
		result = err ? err : data;
		callback(result);
	});
}