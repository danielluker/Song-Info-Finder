#!/bin/env node
//  OpenShift sample Node application
var express = require('express');
var fs      = require('fs');
var path    = require('path');
var Discogs = require('disconnect').Client;
// var app = express(); 

/**
 *  Define the sample application.
 */
var ServerApp = function() {

	var self = this;

	self.store = {
		cur_size : 0,
		max_size : 5,
		lastUpdated : new Date(),
		recent : {},
		// full : function() { return self.store.cur_size >= self.store.max_size} ,
	};

	/*  ================================================================  */
	/*  Helper functions.                                                 */
	/*  ================================================================  */

	/**
	 *  Set up server IP address and port # using env variables/defaults.
	 */
	self.setupVariables = function() {
		//  Set the environment variables we need.
		self.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
		self.port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;

		if (typeof self.ipaddress === "undefined") {
			//  Log errors on OpenShift but continue w/ 127.0.0.1 - self
			//  allows us to run/test the app locally.
			console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
			self.ipaddress = "127.0.0.1";
		};
	};


	/**
	 *  Populate the cache.
	 */
	self.populateCache = function() {
		if (typeof self.zcache === "undefined") {
			self.zcache = { 'index.html': '' };
		}

		//  Local cache for static content.
		self.zcache['index.html'] = fs.readFileSync('./index.html');
	};


	/**
	 *  Retrieve entry (content) from cache.
	 *  @param {string} key  Key identifying content to retrieve from cache.
	 */
	self.cache_get = function(key) { return self.zcache[key]; };


	/**
	 *  terminator === the termination handler
	 *  Terminate server on receipt of the specified signal.
	 *  @param {string} sig  Signal to terminate on.
	 */
	self.terminator = function(sig){
		if (typeof sig === "string") {
		   console.log('%s: Received %s - terminating sample app ...',
					   Date(Date.now()), sig);
		   process.exit(1);
		}
		console.log('%s: Node server stopped.', Date(Date.now()) );
	};


	/**
	 *  Setup termination handlers (for exit and a list of signals).
	 */
	self.setupTerminationHandlers = function(){
		//  Process on exit and signals.
		process.on('exit', function() { self.terminator(); });

		// Removed 'SIGPIPE' from the list - bugz 852598.
		['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
		 'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
		].forEach(function(element, index, array) {
			process.on(element, function() { self.terminator(element); });
		});
	};


	/*  ================================================================  */
	/*  App server functions (main app logic here).                       */
	/*  ================================================================  */

	/**
	 *  Create the routing table entries + handlers for the application.
	 */
	self.createRoutes = function() {

		self.routes = {};

		self.routes['/asciimo'] = function(req, res) {
			var link = "http://i.imgur.com/kmbjB.png";
			res.send("<html><body><img src='" + link + "'></body></html>");
		};

		self.routes['/'] = function(req, res) {
			res.setHeader('Content-Type', 'text/html');
			res.send(self.cache_get('index.html') );
		};

		self.routes['/query'] = function(req, res) {
			// res.set('Content-Type', 'plaintext');
			var searchQuery = JSON.parse(req.query['query']);
			self.addQuery(searchQuery);
			self.findEntry(searchQuery, res, function(result) {
				res.send(result);
			});
		}

		self.routes['/recent_queries'] = function(req, res) {
			res.setHeader('Content-Type', 'application/json');
			res.send(self.store);
			console.log("Sent the recent queries to the client", self.store);
		}

	};


	/**
	 * Function to prepare the query 
	 */
	self.prepareQuery = function(song) {
		var params = {
			'type': 'release',
			'artist': song.artist,
			'year': song.year
		}
		return params;
	};


	/**
	 * Function to query the discogs database
	 */
	self.findEntry = function(query, res, callback) {
		var result = "<h3>None</h3>";
		var db = new Discogs({userToken:"LDCLVKhiodWTTnuZyAIVCBSZkrhcaauGhobLlYbX"}).setConfig({outputFormat: 'html'});
		db = db.database();
		console.log('Querying the discogs databse for', query);
		db.search(query.title, self.prepareQuery(query), function(err, data){
			result = err ? err : data;
			callback(result);
		});
	};


	/**
	 *  Initialize the server (express) and create the routes and register
	 *  the handlers.
	 */
	self.initializeServer = function() {
		self.createRoutes();
		// self.app = express.createServer();
		self.app = express();

		//  Add handlers for the app (from the routes).
		for (var r in self.routes) {
			self.app.get(r, self.routes[r]);
		}

		//  Adding the directory for the files
		console.log(path.join(__dirname, "public"));
		self.app.use(express.static(path.join(__dirname)));

	};


	/**
	 *  Initializes the application.
	 */
	self.initialize = function() {
		self.setupVariables();
		self.populateCache();
		self.setupTerminationHandlers();

		// Create the express server and routes.
		self.initializeServer();
	};


	/**
	 *  Start the server (starts up the application).
	 */
	self.start = function() {
		//  Start the app on the specific interface (and port).
		self.app.listen(self.port, self.ipaddress, function() {
			console.log('%s: Node server started on %s:%d ...',
						Date(Date.now() ), self.ipaddress, self.port);
		});
	};

	self.addQuery = function(query) {
		// if(self.store.full()) {
			for(var i = 4; i > 0; i--) {
				self.store.recent[i] = self.store.recent[i-1];
			}
		// }
		self.store.recent[0] = query;
		console.log("store is", self.store);
		console.log("Added query", query);
	};

};   


/*  Sample Application.  */



/**
 *  main():  Main code.
 */
var zapp = new ServerApp();
zapp.initialize();
zapp.start();

