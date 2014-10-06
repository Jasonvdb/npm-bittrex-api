var stringify = require("querystring").stringify,
    hmac = require("crypto").createHmac,
    request = require("request"),
    hmac_sha512 = require('./hmac-sha512.js'),
    publicMethods = ['getmarkets','getcurrencies','getticker','getmarketsummaries','getorderbook','getmarkethistory'];
    accountMethods = ['getbalances','getbalance','getwithdrawalhistory','getdepositaddress'];

function BittrexClient(key, secret, requeue) {

    var stringify = require("querystring").stringify,
        hmac = require("crypto").createHmac,
        request = require("request"),
        publicMethods = ['getmarkets','getcurrencies','getticker','getmarketsummaries','getorderbook','getmarkethistory'],
        accountMethods = ['getbalances','getbalance','getwithdrawalhistory','getdepositaddress'];

    var self = this;
    
    self.key = key;
    self.secret = secret;
    self.jar = request.jar();
    self.requeue = requeue || 0;
    
    var getNonce = function () {
        return Math.floor(new Date().getTime() / 1000);
    };

    function api_query(method, callback, args) {
        var args_tmp = {};
        
        for (var i in args) {
            if (args[i]) {
                args_tmp[i] = args[i];
            }
        }
        
        args = args_tmp;
        
        var options = {
            uri     : 'https://bittrex.com/api/v1.1',
            agent   : false,
            method  : 'GET',
            jar     : self.jar,
            headers : {
                "User-Agent": "Mozilla/4.0 (compatible; Node Bittrex API)",
                "Content-type": "application/x-www-form-urlencoded"
            }
        };
        
        if (publicMethods.indexOf(method) > -1) {
            options.method = 'GET';
            options.uri = 'http://bittrex.com/api/v1.1/public/' + method + (args ? "?" + stringify(args) : "");
        } else {
            args.apikey = self.key;
            args.nonce = getNonce();
            if (accountMethods.indexOf(method) > -1) {
                options.method = 'GET';
                options.uri = 'https://bittrex.com/api/v1.1/account/' + method + "?" + stringify(args);
            } else {
                options.method = 'GET';
                options.uri = 'https://bittrex.com/api/v1.1/market/' + method + "?" + stringify(args);
            }
            

            if (!self.key || !self.secret) {
                throw new Error("Must provide key and secret to make this API request.");
            }
            else {
                options.headers.apisign = hmac_sha512.HmacSHA512(options.uri, self.secret);
            }
        }

        request(options, function (err, res, body) {
            if (!body || !res || res.statusCode != 200) {
                var requeue = +self.requeue;
                
                if (requeue) {
                    setTimeout(function () {
                        api_query(method, callback, args);
                    }, requeue);
                }
                else if (typeof callback === 'function') {
                    callback.call(this, "Error in server response", null);
                }
            }
            else {
                var error = null;
                var result = null;
                
                try {
                    var response = JSON.parse(body);
                    
                    if (response.error) {
                        error = response.error;
                    }
                    else {
                        result = response.return || response;
                    }
                }
				catch (e) {
                    error = "Error parsing server response: " + e.message;
                }
                
                if (typeof callback === 'function') {
                    callback.call(this, error, result);
                }
            }
        });
    }

    self.getmarkets = function(callback) {
        api_query('getmarkets', callback);
    };

    self.getcurrencies = function(callback) {
        api_query('getcurrencies', callback);
    };
    
    self.getticker = function (marketArg, callback) {
        api_query('getticker', callback, { market: marketArg });
    };
    
    self.getmarketsummaries = function (callback) {
        api_query('getmarketsummaries', callback);
    };
    
    self.getmarketsummary = function (marketArg, callback) {
        api_query('getmarketsummary', callback, { market: marketArg });
    };

    self.getorderbook = function (marketArg, typeArg, depthArg, callback) {
        api_query('getorderbook', callback, { market: marketArg, type: typeArg, depth: depthArg });
    };

    self.getmarkethistory = function (marketArg, countArg, callback) {
        api_query('getmarkethistory', callback, { market: marketArg, count: countArg });
    };
    
    self.buylimit = function (marketArg, quantityArg, rateArg, callback) {
        api_query('buylimit', callback, { market: marketArg, quantity: quantityArg, rate: rateArg });
    };

    self.buymarket = function (marketArg, quantityArg, callback) {
        api_query('buymarket', callback, { market: marketArg, quantity: quantityArg });
    };

    self.selllimit = function (marketArg, quantityArg, rateArg, callback) {
        api_query('selllimit', callback, { market: marketArg, quantity: quantityArg, rate: rateArg });
    };
    
    self.sellmarket = function (marketArg, quantityArg, callback) {
        api_query('sellmarket', callback, { market: marketArg, quantity: quantityArg });
    };

    self.cancel = function (uuidArg, callback) {
        api_query('cancel', callback, { uuid: uuidArg });
    };

    self.getopenorders = function (marketArg, callback) {
        api_query('getopenorders', callback, { market: marketArg });
    };

    self.getbalances = function (callback) {
        api_query('getbalances', callback);
    };

    self.getbalance = function (currencyArg, callback) {
        api_query('getbalance', callback, { currency: currencyArg });
    };

    self.getdepositaddress = function (currencyArg, callback) {
        api_query('getdepositaddress', callback, { currency: currencyArg });
    };

    self.withdraw = function (currencyArg, quantityArg, addressArg, paymentId, callback) {
        if (paymentId) {
            api_query('withdraw', callback, { currency: currencyArg, quantity: quantityArg, address: addressArg, paymentid: paymentId });
        } else {
            api_query('withdraw', callback, { currency: currencyArg, quantity: quantityArg, address: addressArg });
        }
    };

    self.getorder = function (uuidArg, callback) {
        api_query('getorder', callback, { uuid : uuidArg });
    };

    self.getorderhistory = function (marketArg, countArg) {
        api_query('getorderhistory', callback, { market: marketArg, count: countArg });
    };

    self.getwithdrawalhistory = function (currencyArg, countArg) {
        api_query('getwithdrawalhistory', callback, { currency: currencyArg, count: countArg });
    };

    self.getdeposithistory = function (currencyArg, countArg) {
        api_query('getdesposithistory', callback, { currency: currencyArg, count: countArg });
    };
}

module.exports = BittrexClient;

