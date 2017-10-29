module.exports = function(app){

	var multer  = require('multer') ;
	var storage = multer.diskStorage({
	    destination: function (req, file, cb) {
	        //cb(null, 'public/images')
	        cb(null, '')
	    }
	});
	var upload = multer({ storage: storage });
	
	app.options('*', function(req, res) {
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Credentials', true); 
		res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELTE, OPTIONS');
		res.header('Access-Control-Allow-Headers', 'Content-Type'); 
	});

	app.post('/sendpage', function(req, res){
		//console.log(req.body);
		var imgData = req.body.img ;
		var base64Data = imgData.replace(/^data:image\/png;base64,/, "");
		require("fs").writeFile("out.png", base64Data, 'base64', 
		function(err, data) {
			if (err) {
				console.log('err', err);
			}
			console.log('success');
			require( './watson.js' )( res ) ;
		});

		//res.status(200).json({result: 'hello world'});
	});

	app.get( '/upload' , function( req , res ){ 
		res.render( 'upload' ) ;
	}) ; 

	app.post('/upload' , upload.single('picture') , function( req , res ) {
		//require('./watson.js')( res , req.file.filename ) ;
		res.render( 'upload' ) ;
	}) ;
};
