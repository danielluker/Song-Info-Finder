//----------------------------------------------------------------------
// Contollers for the release pages
//----------------------------
// By Daniel Luker 04/VIII/2015
//-----------------------------------------------------------------------

'use strict'; 

console.log("in here")

/*
 * Controller for the release pages
 */
var releasePage = angular.module('release-page', ['ngCookies']);

releasePage.controller('release_controller', ['$scope', '$cookies', function($scope, $cookies) {
	// bla bla
	$scope.release = $cookies.get('selectedQuery');

}]);