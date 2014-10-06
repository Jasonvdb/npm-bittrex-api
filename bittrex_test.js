
var bittrex = require('./bittrex.js');
var async = require('async');

var bittrexApi = new bittrex("apikey", "apisecret");


bittrexApi.getmarkets(function(error, response) {
    console.log('getmarkets: ' + JSON.stringify(response));
});

bittrexApi.getcurrencies(function (error, response) {
    console.log('getcurrencies: ' + JSON.stringify(response));
});

bittrexApi.getticker('BTC-UTC', function (error, response) {
    console.log('getticker: ' + JSON.stringify(response));
});

bittrexApi.getmarketsummaries(function (error, response) {
    console.log('getmarketsummaries: ' + JSON.stringify(response));
});

bittrexApi.getmarketsummary('BTC-UTC', function (error, response) {
    console.log('getmarketsummary: ' + JSON.stringify(response));
});

bittrexApi.getorderbook('BTC-UTC', 'both', 50, function (error, response) {
    console.log('getorderbook: ' + JSON.stringify(response));
});

bittrexApi.getmarkethistory('BTC-UTC', 20, function (error, response) {
    console.log('getmarkethistory: ' + JSON.stringify(response));
});

//bittrexApi.buylimit(marketArg, quantityArg, rateArg, function (error, response) {
//    console.log(JSON.stringify(response));
//});
//bittrexApi.buymarket(marketArg, quantityArg, function (error, response) {
//    console.log(JSON.stringify(response));
//});

//bittrexApi.selllimit(marketArg, quantityArg, rateArg, function (error, response) {
//    console.log(JSON.stringify(response));
//});

//bittrexApi.sellmarket('BTC-UTC', quantityArg, function (error, response) {
//    console.log(JSON.stringify(response));
//});

bittrexApi.cancel('arasdasdasdas', function (error, response) {
    console.log('cancel: ' + JSON.stringify(response));
});

bittrexApi.getopenorders('BTC-UTC', function (error, response) {
    console.log('getopenorders: ' + JSON.stringify(response));
});

bittrexApi.getbalances(function (error, response) {
    console.log('getbalances: ' + JSON.stringify(response));
});

bittrexApi.getbalance('BTC', function (error, response) {
    console.log('getbalance: ' + JSON.stringify(response));
});

bittrexApi.getdepositaddress('BTC', function (error, response) {
    console.log('getdepositaddress: ' + JSON.stringify(response));
});

bittrexApi.withdraw('UTC', 0.1, 'address', null, function (error, response) {
    console.log('withdraw: ' + JSON.stringify(response));
});

bittrexApi.getorder('asdfasdf', function (error, response) {
    console.log('getorder: ' + JSON.stringify(response));
});

bittrexApi.getorderhistory('BTC-UTC', 10, function(error, response) {
console.log('getorderhistory: ' + JSON.stringify(response));
});

bittrexApi.getwithdrawalhistory('BTC', 10, function (error, response) {
    console.log('getwithdrawalhistory: ' + JSON.stringify(response));
});

bittrexApi.getdeposithistory('BTC', 10, function (error, response) {
    console.log('getdeposithistory: ' + JSON.stringify(response));
});
