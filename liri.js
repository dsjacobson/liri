require("dotenv").config();

var keys = require("./keys.js");
var liriCommand = process.argv[2];

//tweets command
if (liriCommand === "my-tweets") {
	latestTweets();
}

//spotify command (search for "The sign" by Ace of Base if empty)
else if (liriCommand === "spotify-this-song") {
	
	if (process.argv.length > 3) {
		spotifySongs(process.argv[3]);
	}
	else {
		spotifySongs("The Sign Ace of Base");
	}
}



//OMBD command (Use "Mr. Noboady" as default search)
else if (liriCommand === "movie-this") {
	
	if (process.argv.length > 3) {
		searchMovie(process.argv[3]);
	}
	else {
		searchMovie("Mr.Nobody");

	}
}

//LIRI commands 
else if (liriCommand === "do-what-it-says") {
	var fs = require("fs");
	fs.readFile("random.txt", "utf8", function(error, data) {
		
		if (error) {
			console.log(error);
		}
		var liri = data.split(",");
		if (liri[0] === "my-tweets") {
			searchTwitter();
		}
		if (liri[0] === "spotify-this-song") {
			searchSpotify(liri[1]);
		}
		if (liri[0] === "movie-this") {
			searchMovie(liri[1]);
		}
	});
}

//Latest tweets function **Only have 7 total tweets on my personal account**
function latestTweets() {
	var Twitter = require("twitter");
	var client = new Twitter(keys.twitter);
	var params = {screen_name: 'DJacobson32'};
	
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
		
		if (!error) {
			console.log("Your last 7 tweets were:\n");
				//Would change 7 to 20 if I had more tweets
			for (i=0;i<7;i++) {
				var text = tweets[i].text+"\n";
				var created = tweets[i].created_at+"\n";
				console.log(text+created);
			}
	    }
	});

}


function searchMovie(movie) {
	var name = movie;
	var apiKey = "trilogy";
	var queryURL = "http://www.omdbapi.com/?apikey="+apiKey+"&"+"t="+name;

	var request = require('request');
	
	request.get(queryURL, function (error, response, body) {

		var result = JSON.parse(body);
		var title = "Title: "+result.Title+"\n";
		var year = "Year: "+result.Year+"\n";
		var imdb = "Imdb Rating: "+result.Ratings[0].Value+"\n";
		var tomato = "Rotten Tomatoes Rating: "+result.Ratings[1].Value+"\n";
		var country = "Country: "+result.Country+"\n";
		var language = "Language: "+result.Language+"\n";
		var plot = "Plot: "+result.Plot+"\n";
		var actors = "Actors: "+result.Actors+"\n";

		console.log(title+year+imdb+tomato+country+language+plot+actors);
	});
}


// Spotify function
function spotifySongs(song) {
	var Spotify = require('node-spotify-api');
	var spotify = new Spotify(keys.spotify);
	
	spotify.search({ type: 'track', query: song, limit: 20 }, function(err, data) {
		
		if (err) {
	    	return console.log("Error: " + err);
		}
	 
		var artist = "Artist: "+data.tracks.items[0].album.artists[0].name;
		var song = "Song: "+data.tracks.items[0].name;
		var previewURL = "Preview URL: "+data.tracks.items[0].external_urls.spotify;
		var album = "Album: "+data.tracks.items[0].album.name+"\n";
		
		console.log(artist+"\n"+song+"\n"+previewURL+"\n"+album); 
	});
}



