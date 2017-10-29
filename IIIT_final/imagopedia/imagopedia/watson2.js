module.exports = function( response ) {
	console.log( "HI0" ) ;
	var VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');
	var fs = require('fs');

	console.log( "HI122" ) ;

	var visual_recognition = new VisualRecognitionV3({
	api_key: '985900d237feb4fe7dc3fff58b3ace4bf5db1340',
	version_date: VisualRecognitionV3.VERSION_DATE_2016_05_20
	});

	console.log( "HI11" ) ;

	var params = {
	images_file: fs.createReadStream('out.png') 
	};

	var params2 = {
	images_file: fs.createReadStream('out.png') 
	};

	console.log( "HI10" ) ;
        
    var t, e, g;

    //Face detection and image classification
	visual_recognition.detectFaces(params, function(err, res) {
		console.log( "HI1" ) ;
		if (err)
		  console.log(err);
		else
		{
		    if( res.images[0].faces && res.images[0].faces.length > 0 && 
		    	res.images[0].faces[0] && res.images[0].faces[0].identity )
		    {
				var celeb = res.images[0].faces[0].identity.name ;
				console.log( celeb ) ;
				console.log( "HI1" ) ;
				twitter( celeb ) ;
				ebay( celeb ) ;
				google( celeb ) ;
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
					console.log( ar[i].class ) ;
					console.log( ar[i].type_hierarchy ) ;
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
			        console.log( tag ) ;
			        console.log( arr ) ;
			        twitter( tag ) ;
			        ebay( arr ) ;
			        google( tag ) ;
					response.render("index.ejs", {twitter: t, ebay: e, google: g});
		        }
		      });
		    }


		}
	});

    //Elements detection
    function twitter( celeb ){
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

				var lol = { 'tweets': result1 , 'users':result2 };
				t = lol ;

				console.log('Twitter\n\n\n\n' );
				console.log( lol ) ;
			}) ;
		}) ;
    }


    function ebay( tags ){
        var ebay = require('ebay-api/index.js');
        var params = {
			keywords: tags ,

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
            appId: 'AvishekS-clippy-PRD-15d705b3d-a64f967f',      
            params: params,
            parser: ebay.parseResponseJson 
        },
          
        function itemsCallback(error, itemsResponse) {
            if (error) 
            	throw error;
            var items = itemsResponse.searchResult.item;
            result = [];
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
          }
        );
    }

	function google( tags ){
		var google = require('google') ;
		google.resultsPerPage = 10 ;
		var nextCounter = 0 ;

		var result = [] ;
		google( tags , function (err, res){
			if (err) 
				console.error(err) ;
			if( res )
			{
				for (var i = 0; i < res.links.length; ++i) {
					var link = res.links[i];
					var obj = { 'url':link.href , 'title':link.title };
					result.push(obj) ;
				}
			}
			console.log('Google\n\n\n\n' );
			console.log( result ) ;
			g = result;
		}) ;
	}
};