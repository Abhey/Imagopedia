var google = require('google') ;
 
google.resultsPerPage = 10 ;
var nextCounter = 0 ;
 
var result = [] ;
google('spoj', function (err, res){
  if (err) 
    console.error(err) ;
  
  for (var i = 0; i < res.links.length; ++i) {
    var link = res.links[i];
    //console.log(link.title + ' - ' + link.href) ;
    var obj = { 'url':link.href , 'title':link.title };
    result.push(obj) ;
    // titles.push( link.title ) ;
    //console.log(link.description + "\n") ;
  }
  /*if (nextCounter < 4) {
    nextCounter += 1 ;
    if (res.next) 
      res.next() ;
  }*/
  // var obj = { "titles" : titles , "links" : links } ;
  console.log( result ) ;
  
}) ;
