var express = require( 'express' ) ;
var app = express( ) ;
var port = 8080 ;
var bodyParser  = require('body-parser');
var cors = require('cors');
var morgan = require('morgan');


app.use(morgan('dev'));

app.use(cors());


app.use(bodyParser.urlencoded({extended : true, limit: '50mb'}));
app.use(bodyParser.json({limit: '50mb'}));

app.set( 'view engine' , 'ejs' ) ;

app.use( express.static( __dirname + '/public' ) ) ;

app.listen( port ) ;

require('./routes.js')(app);

console.log( 'Listening on port ' + port ) ;