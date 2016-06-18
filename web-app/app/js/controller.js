//----------------------------------------------------------------------
// Contollers for Application
//----------------------------
// By Daniel Luker 04/VIII/2015
//-----------------------------------------------------------------------
'use strict';

var mainApplication = angular.module('mainPage', []);

// This line of code can only run if we are on a properly set up node server
var Discogs = require('disconnect').Client;


/***
 *
 */
mainApplication.controller('SearchController', ['$scope', function($scope) {
    $scope.results = [];
    $scope.currentSong = {};
    $scope.song = {
        title: function(newName) {
            return arguments.length ? ($scope.currentSong.title = newName) : (
                $scope.currentSong.title ? $scope.currentSong.title : "");
        },
        artist: function(newArtist) {
            return arguments.length ? ($scope.currentSong.artist = newArtist) : (
                $scope.currentSong.artist ? $scope.currentSong.artist : "");
        },
        album: function(newAlbum) {
            return arguments.length ? ($scope.currentSong.album = newAlbum) : (
                $scope.currentSong.album ? $scope.currentSong.album : "");
        },
        year: function(newYear) {
            return arguments.length ? ($scope.currentSong.year = newYear) : (
                $scope.currentSong.year ? $scope.currentSong.year : "");
        },
        printSong: function() {
            console.log($scope.currentSong);
        },
    };
    $scope.addSong = function(song) {
        $scope.results.push(song);
    }
    $scope.performQuery = function() {
    	$scope.results = [];
        var dat = "";
        var release = "";


        // $.get("/query", {
        //     'query': JSON.stringify($scope.currentSong)
        // }, function(data) {
        //     dat = data;
        // }).done(function() {

        findEntry($scope.currentSong, function(dat) {
            var results = dat.results;
            results.forEach(function(song) {
                $.get(song.resource_url, function(rel) {
                    release = rel;
                    console.log("release", release);
                }).done(function() {
                    var sng = new Release(release.title, release.artists[0].name, release.year);
                    sng.imageURL = song.thumb;
                    sng.tracklist = release.tracklist
                    console.log(sng.tracklist);
                    $scope.addSong(sng);
                    try {
                        $scope.$apply();
                    } catch (err) {
                        // Do nothing, it's probably a repeat error, which can happen 
                        // when a user clicks the query button serveral times. Just ignore
                    }
                    console.log(song);
                });
            })
            console.log($scope.results);
        });
    };
    $scope.clearQuery = function() {
        $scope.results = [];
        $scope.currentSong = {};
    }
}]);


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


/***
 * Generating the filter to only display songs matching the search
 * criteria.
 */
mainApplication.filter('SongFilter', function() {
    return function(input, query) {
        if (!query)
            return input;
        var result = [];
        angular.forEach(input, function(song) {
            var insert = false;
            if (query.title() != 'undefined' && query.title() != '')
                insert = (song.title.toLowerCase().indexOf(query.title().toLowerCase()) > -1);
            if (query.artist() != 'undefined' && query.artist() != '')
                insert = (song.artist.toLowerCase().indexOf(query.artist().toLowerCase()) > -1);
            if (query.album() != 'undefined' && query.album() != '')
                insert = (song.album.toLowerCase().indexOf(query.album().toLowerCase()) > -1);
            if (query.year() != 'undefined' && query.year() != '')
                insert = (song.year.indexOf(query.year()) > -1);
            if (insert)
                result.push(song);
        });
        return result;
    }
});