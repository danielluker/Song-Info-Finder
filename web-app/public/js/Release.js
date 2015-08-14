// Module to model the songs

function Release(title, artist, year) {
	this.title = title;
	this.artist = artist;
	this.year = year;
	this.genre = [];
	this.imageURL = '';
	this.tracklist = [];
}