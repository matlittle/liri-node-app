// Dependencies
const Keys = require('./keys.js');
const FS = require('fs');

var cmd = process.argv[2];

switch (cmd) {
	case 'my-tweets':
		logTweets();
		break;
	case 'spotify-this-song':
		logSong( process.argv[3] );
		break;
	case 'movie-this':
		logMovie( process.argv[3] );
		break;
	case 'do-what-it-says':
		console.log("do what it says");
		break;
	default:
		console.log('Unrecognized command');
		break;
}

function logTweets() {
	const Twitter = require('twitter');

	const client = new Twitter(Keys.twitter);

	var params = {
		count: '20'
	};

	Client.get('statuses/user_timeline', params, function(err, tweets, res){
		if (!err) {
			var str = '';
			tweets.forEach( function(tweet) {
				var time = tweet.created_at.substring(0, 19);
				var text = tweet.text;
				str += `${time} - ${text}\n`;
			});
		} else {
			str = err;
		}

		console.log(str);
		logToFile(str);
	});
}

function logSong(song) {
	if (!song) song = "The Sign, Ace of Base";

	const Spotify = require('node-spotify-api');
	const client = new Spotify(Keys.spotify);

	client.search({
		type: 'track',
		query: song,
		limit: 1
	}, (err, data) => {
		if (err) throw err;

		var str = "";
		const ret = data.tracks.items[0];

		str += `Song:  ${ret.name}\n`
		str += `Artist: ${ret.artists[0].name}\n`
		str += `Album: ${ret.album.name}\n`
		str += `Preview: ${ret.external_urls.spotify}\n`

		console.log(str);
		logToFile(str);
	});
}

function logMovie(movie) {
	if (!movie) movie = "Mr. Nobody";

	const Request = require('request');
	const apiKey = '40e9cece';
	var url = `http://www.omdbapi.com?apikey=${apiKey}`;

	url += `&t=${movie.replace(' ', '+')}`;

	Request(url, (err, res, body) => {
		var obj = JSON.parse(body);
		var str = '';
		var imdbRate, rtRate;

		obj.Ratings.forEach( (rating) => {
			if (rating.Source === 'Rotten Tomatoes') {
				rtRate = rating.Value;
			} else if (rating.Source === 'Internet Movie Database') {
				imdbRate = rating.Value;
			}
		});

		str += `Title: ${obj.Title}\n`;
		str += `Year: ${obj.Year}\n`
		str += `IMDB Rating: ${imdbRate}\n`
		str += `Rotten Tomatoes Rating: ${rtRate}\n`
		str += `Country: ${obj.Country}\n`
		str += `Language: ${obj.Language}\n`
		str += `Plot: ${obj.Plot}\n`
		str += `Actors: ${obj.Actors}\n`

		console.log( str );
		logToFile( str );
	})

}

function loadCommand() {
	
}

function logToFile(str) {
	var date = new Date;
	var newStr = `\n${date.toString()}:\n${str}\n`

	FS.appendFile('log.txt', newStr, (err) => {
		if(err) throw err;
	});
}

