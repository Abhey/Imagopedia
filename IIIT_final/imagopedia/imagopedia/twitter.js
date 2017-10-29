module.exports = { 
	func : function( celeb )
	{
		var result1 = [] ;
		var result2 = [] ;
		var Twit = require('twit');
		var config = require('./config.js');
		var T = new Twit(config);

		T.get('search/tweets', { q: celeb + ' since:2011-07-11', count: 10 }, function(err, data, response) {
			// var username = data.statuses[0].user.screen_name;
			for(var i = 0; i < data.statuses.length;i++)
			{
				var id = data.statuses[i].id_str;
				var text = data.statuses[i].text;
				// console.log("https://twitter.com/statuses/"+id);
				var links = "https://twitter.com/statuses/"+id;
				var obj = { 'url': links , 'title': text};
				result1.push(obj);
			}
			T.get('users/search', { q: celeb , count: 5 }, function(err, data, response) {

				for(var i = 0;i < data.length;i++)
				{
					var link = "https://www.twitter.com/"+data[i].name;
					var obj = { 'url':link , 'title':data[i].name };
					result2.push(obj);
					// console.log(data[i].name);
				}
				var lol = { 'tweets': result1 , 'profiles':result2};
				console.log(lol);
			}) ;
		  	// console.log(data.statuses[0]) ;
		}) ;
	}
} ;