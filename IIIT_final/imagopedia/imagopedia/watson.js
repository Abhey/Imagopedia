module.exports = function( response123 ) {

	var fs = require('fs');
	var VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');
	var visual_recognition = new VisualRecognitionV3({
	api_key: '<Your IBM Watson API KEY>',
	version_date: VisualRecognitionV3.VERSION_DATE_2016_05_20
	});

	//console.log( "Hi 1" ) ;

	var params = {
	images_file: fs.createReadStream( 'out.png' ) 
	};

	var params2 = {
	images_file: fs.createReadStream( 'out.png' ) 
	};

        
    //Face detection and image classification
	visual_recognition.detectFaces(params, function(err, res) {
		//console.log( "Hi 2" ) ;
		if (err)
		  console.log(err);
		else
		{
		    if( res.images[0].faces && res.images[0].faces.length > 0 && 
		    	res.images[0].faces[0] && res.images[0].faces[0].identity )
		    {

				var celeb = res.images[0].faces[0].identity.name ;
				//console.log( celeb ) ;
				//console.log( "HI1" ) ;

				solve(celeb, celeb);

		    }
		    else
		    {
		      	visual_recognition.classify(params2, function(err, res) {
		        if (err)
		          console.log(err);
		        else
		        {
					var ar = res.images[0].classifiers[0].classes;
					console.log(res.images[0].classifiers[0]);
					var arr = [] ; 
					var tag = '' ;
					for(var i = 0 ; i < ar.length ;i++)
					{
					var hierarchy = ar[i].type_hierarchy ;
					//console.log( ar[i].class ) ;
					//console.log( ar[i].type_hierarchy ) ;
					if( hierarchy )
					{
						var val = '' , val1 = '' ;
						for( j = 0 ; j < hierarchy.length ; j++ )
						{
							if( hierarchy.charAt( j ) == '/' )
							{
							  val1 = val ; val = '' ;
							}
							else
							  val += hierarchy.charAt( j ) ;
							}
							val1 = val ;
							arr.push( val1 ) ;
							tag = tag + ' ' + val1 ;
						}
		        	}
			        //console.log( tag ) ;
			        //console.log( arr ) ;

			        solve(tag, arr);

		        }
		      });
		    }

		}
	});

	function solve( tag, arr ){

		var Twit = require('twit');
		var config = require('./config.js');
		var T = new Twit(config);
		var t, e, g , y ;

		T.get('search/tweets', { q: tag + ' since:2011-07-11', count: 10 }, function(err, data, response) {

			var result1 = [], result2 = [];

			if( data.statuses )
			{
				for(var i = 0; i < data.statuses.length; ++i){
					var id = data.statuses[i].id_str;
					var text = data.statuses[i].text;
					var links = "https://twitter.com/statuses/"+id;
					var obj = { 'url': links , 'title': text};
					result1.push(obj);
				}
			}

			T.get('users/search', { q: tag , count: 5 }, function(err, data, response) {

				for(var i = 0;i < data.length;i++){
					var link = "https://www.twitter.com/"+data[i].screen_name;
					var obj = { 'url':link , 'title':data[i].screen_name };
					result2.push(obj);
				}

				t = { 'tweets': result1 , 'profiles':result2 };

				console.log('Twitter\n\n\n\n' );
				console.log( t ) ;

				var ebay = require('ebay-api/index.js');
		        var params = {
					keywords: arr ,

					outputSelector: ['AspectHistogram'],

					paginationInput: {
					entriesPerPage: 10
					},

					itemFilter: [
					{ name: 'FreeShippingOnly', value: true },
					{ name: 'MaxPrice', value: '150' }
					],
		        };

		        ebay.xmlRequest({
		            serviceName: 'Finding',
		            opType: 'findItemsByKeywords',
		            appId: '<Your ebay appId>',      
		            params: params,
		            parser: ebay.parseResponseJson 
		        },
		          
		        function itemsCallback(error, itemsResponse) {
		            if (error) 
		            	throw error;
		            var items = itemsResponse.searchResult.item;
		            var result = [];
		            if( items )
		            {
						for (var i = 0; i < items.length; i++) {
							var obj = {'url': items[i].viewItemURL , 'title': items[i].title };
							result.push(obj);
						} 
		            }
		            console.log('Ebay\n\n\n\n' );
		            console.log( result ) ;
		            e = result;

					var google = require('google') ;

					google.resultsPerPage = 10 ;
					var nextCounter = 0 ;
					result = [] ;

					google( arr , function (err, res){
						if (err) 
							console.error(err) ;
						if( res ){
							for (var i = 0; i < res.links.length; ++i) {
								var link = res.links[i];
								var obj = { 'url':link.href, 'title':link.title };
								result.push(obj) ;
							}
						}
						console.log('Google\n\n\n\n' );
						console.log( result ) ;
						g = result;

						//Youtube code.
						var search = require('youtube-search');
						var opts = {
							maxResults: 5,
							key: '<Your youtube data API key>'
						}; 
						search( tag , opts, function(err, results) {
							if(err) 
								return console.log(err);
							var y_results = [] ;
							for( var i = 0 ; i < results.length ; i++ )
							{
								var obj = { 'url' : results[i].link , 'title' : results[i].title } ;
								if( results[i].kind === 'youtube#video' )
								y_results.push( obj ) ; 
							}
							y = y_results ;
							console.log( 'Youtube\n\n\n\n' ) ;
							console.log( y ) ;
							response123.render( 'home' , { twitter : t , google : g , ebay : e , youtube : y } ) ;
						});
						//Youtube code ends.

					}) ;

		          }
		        );

			}) ;
		}) ;

	}
};
