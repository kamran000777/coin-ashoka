var request = require('request');
const urlBuilder = require('build-url');

function getRandomInt(min, max) {
  return Math.floor(
    Math.random() * (max - min + 1) + min
  )
}

function randomString(length) {
  let r = '';
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  for (let i = 0; i < length; i++)
    r += charset.charAt(Math.floor(Math.random() * charset.length));
   
  return r;
}

function getCoinPrices() {
  return new Promise((resolve, reject) => {
    var options = {
      method: 'GET',
      url: 'https://api.coindcx.com',
      json: true,
      headers: {
        'content-type': 'application/json',
        "accept": "application/json",
        "host": "api.coindcx.com"
      }
    };
    function callback(error, response, body) {
      //return response;
      // console.log("Response is :",response);
      if (!error && response.statusCode == 200) {
        //console.log("error is", error);
        //console.log(body);

        resolve(body);
      } else {
        reject(error);
      }
    }
    //call the request

    request(options, callback);
  })

}

function getCryptoHistoryPrices(coin_pair,interval) {
  return new Promise((resolve, reject) => {

    const baseurl = "https://public.coindcx.com"

    // Replace the "B-BTC_USDT" with the desired market pair.
    request.get(baseurl + "/market_data/candles?pair="+coin_pair+"&interval="+interval+"&limit=500", function (error, response, body) {
      if (error) {
        reject(error);
      } else {
        //console.log(body);
        resolve(body);
      }

    })
  })

}

var  getDateString = function(date, format) {
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  getPaddedComp = function(comp) {
      return ((parseInt(comp) < 10) ? ('0' + comp) : comp)
  },
  formattedDate = format,
  o = {
      "y+": date.getFullYear(), // year
      "M+": months[date.getMonth()], //month
      "d+": getPaddedComp(date.getDate()), //day
      "h+": getPaddedComp((date.getHours() > 12) ? date.getHours() % 12 : date.getHours()), //hour
       "H+": getPaddedComp(date.getHours()), //hour
      "m+": getPaddedComp(date.getMinutes()), //minute
      "s+": getPaddedComp(date.getSeconds()), //second
      "S+": getPaddedComp(date.getMilliseconds()), //millisecond,
      "b+": (date.getHours() >= 12) ? 'PM' : 'AM'
  };

  for (var k in o) {
      if (new RegExp("(" + k + ")").test(format)) {
          formattedDate = formattedDate.replace(RegExp.$1, o[k]);
      }
  }
  return formattedDate;
};

function toDateTime(secs) {
  // var t = new Date(1970, 0, 1); // Epoch
  // t.setSeconds(secs);
  var t = new Date(Date.UTC(1970, 0, 1)); // Epoch
    t.setUTCSeconds(secs);
  return t;
}


function makeDynamicLongLink(endpoint, token, toEmail) {
  const hostUrl = process.env.hostURL;
  const baseUrl = process.env.baseUrl;
  const appPackage = process.env.appPackage;
return urlBuilder(`${baseUrl}`, {
  queryParams: {
    link: hostUrl + "/" + endpoint + "?" + "token=" + token + "&email=" + toEmail,
    apn: appPackage,
  }
});
}

module.exports = { getRandomInt, getCoinPrices, getCryptoHistoryPrices,getDateString,toDateTime,randomString,makeDynamicLongLink}