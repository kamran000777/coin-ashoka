const usersDao = require('../dao/users.js');
const coinsDao = require('../dao/coins.js');
const common = require('../utils/common');
const RequestHandler = require('../utils/RequestHandler');
const Logger = require('../utils/logger');
const logger = new Logger();
const requestHandler = new RequestHandler(logger);
const auth = require('../utils/auth');

async function getUserInfo(req, res, next) {

    const dbresult = await usersDao.healthInfo(req.body);

    const data = dbresult.rows;

    return res.json({
        status: 1,
        data: data
    })
}

async function getUserProfile(req,res,next){

    try{
        const user = auth.getUserInfo(req);  
        const dbresult = (await usersDao.getUserProfile(user,req.query)).rows;
        const result = JSON.parse(dbresult[0]['fn_get_user_profile_wrt_global_04_0ct']);

        requestHandler.sendSuccess(res, 'Success',result);
    }catch(error){
        requestHandler.sendError(req, res, error);
    }
}

async function getCryptoCoinLatestPrices() {

    try {

        const result = await common.getCoinPrices();
        
        const cryptoPrice = result['currenct_prices']['USDCINR'];

        await coinsDao.insertLatestCoinPrices(Number(cryptoPrice).toFixed(4));
        return 1;
        //requestHandler.sendSuccess(res, 'Success', data);
    } catch (error) {
        // requestHandler.sendError(req, res, error);
        return error;
    }
}

async function getCryptoCoinHistoryPrices(req, res) {

    try {


        const result = await common.getCryptoHistoryPrices(req.query.coin_pair, req.query.interval);
        //console.log("Result is:", result);
        requestHandler.sendSuccess(res, 'Success', JSON.parse(result));
        const coin_name = (req.query.coin_pair).split('-')[1];
        const data = await coinsDao.insertHistoryCoinPrices(coin_name, result);
        requestHandler.sendSuccess(res, 'Success', data);
    } catch (error) {
        requestHandler.sendError(req, res, error);
    }
}

async function getCryptoCoinHistoryPricesAuto() {
    try {

        const dbresult = await coinsDao.getAllCoins();
        var coinData = dbresult.rows;

        var coin_pair;
        var interval = "5m";
        for (var i = 0; i < coinData.length; i++) {
            coin_pair = "I-" + coinData[i].name + "_INR";
            const result = await common.getCryptoHistoryPrices(coin_pair, interval);
            //console.log("Result is:", result);

            const coin_name = (coin_pair).split('-')[1];
            await coinsDao.insertHistoryCoinPrices(coin_name, result);
        };
        return 1;
        //requestHandler.sendSuccess(res, 'Success', data);
    } catch (error) {
        // requestHandler.sendError(req, res, error);
        return error;
    }
}

module.exports = { getUserInfo,getUserProfile, getCryptoCoinLatestPrices, getCryptoCoinHistoryPrices, getCryptoCoinHistoryPricesAuto }