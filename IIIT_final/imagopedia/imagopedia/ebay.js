var ebay = require('ebay-api/index.js');

var params = {
  keywords: ["Bottle"],

  outputSelector: ['AspectHistogram'],

  paginationInput: {
    entriesPerPage: 10
  },

  itemFilter: [
    {name: 'FreeShippingOnly', value: true},
    {name: 'MaxPrice', value: '150'}
  ],

  /*domainFilter: [
    {name: 'domainName', value: 'Digital_Cameras'}
  ]*/
};

ebay.xmlRequest({
    serviceName: 'Finding',
    opType: 'findItemsByKeywords',
    appId: 'AvishekS-clippy-PRD-15d705b3d-a64f967f',      
    params: params,
    parser: ebay.parseResponseJson 
  },
  
  function itemsCallback(error, itemsResponse) {
    if (error) throw error;

    var items = itemsResponse.searchResult.item;

    // console.log('Found', items.length, 'items');
      
    // console.log(items[0]);  

    result = [];

    for (var i = 0; i < items.length; i++) {
      //console.log( items[i] ) ;
      var obj = {'url': items[i].viewItemURL , 'title': items[i].title };
      result.push(obj); 
      // console.log(items[i].viewItemURL);
    } 
    console.log(result); 
  }
);