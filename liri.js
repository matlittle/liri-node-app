// Packages
const fs = require('fs');
const request = require('request')

var cmd = process.argv[2];

switch (cmd) {
	case 'my-tweets':
		logTweets();
		break;
	case 'spotify-this-song':
		console.log("spotify thing");
		logSong(process.argv[3]);
		break;
	case 'movie-this':
		console.log("movie thing");
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
	const Keys = require('./keys.js');

	var client = new Twitter(Keys);

	var params = {
		count: '20'
	};

	client.get('statuses/user_timeline', params, function(err, tweets, res){
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
	if (!song) console.log('Please provide a song');

	var qUrl = 'https://accounts.spotify.com/api'

	request.post(
		`${qUrl}/token`,
		

	)
}

function logToFile(str) {
	var date = new Date;
	var newStr = `\n${date.toString()}:\n${str}\n`
	fs.appendFile('log.txt', newStr, (err) => {
		if(err) throw err;
	});
}

