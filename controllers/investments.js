const investmentsDao = require('../dao/investments.js');
const cryptoApiLogs = require('../dao/cryptoApiLogs');
const RequestHandler = require('../utils/RequestHandler');
const config = require('../config/appconfig');
const Logger = require('../utils/logger');
const auth = require('../utils/auth');
const logger = new Logger();
const requestHandler = new RequestHandler(logger);

const { db } = require('../utils/dbconfig.js');

async function getUserPortfolio(req,res,next){

    try{
        const user = auth.getUserInfo(req);  
        const dbresult = await investmentsDao.getUserPortfolio(user);
        const result = dbresult.rows;
        const content = JSON.parse(result[0]['fn_get_user_portfolio']);
        requestHandler.sendSuccess(res, 'Success',content);
    }catch(error){
        requestHandler.sendError(req, res, error);
    }
}

async function getUserDashboard(req,res,next){

    try{
        const user = auth.getUserInfo(req);  
        const dbresult = (await investmentsDao.getUserDashboardData(user)).rows;
        const result = JSON.parse(dbresult[0]['get_user_portfolio']);
  
        const data = result;
        data.portfolio['about']= 'Welcome to Coin Ashoka, your go-to platform for easy, safe, and profitable crypto investments. With a fixed 2% interest rate every month on your invested amount, you can watch your savings grow while taking advantage of the exciting world of cryptocurrency.\nJoin us today and start investing in the future of finance!'
        requestHandler.sendSuccess(res, 'Success',data);
    }catch(error){
        requestHandler.sendError(req, res, error);
    }
}

async function getCoinData(req,res,next){

    try{
        const user = auth.getUserInfo(req);  
        const dbresult = (await investmentsDao.getSingleCoinData(user,req.query)).rows;
        const result = JSON.parse(dbresult[0]['fn_get_single_coin_data_wrt_global_27_sept']);

        requestHandler.sendSuccess(res, 'Success',result);
    }catch(error){
        requestHandler.sendError(req, res, error);
    }
}

async function getOrderHistory(req, res){
    try {
        const user = auth.getUserInfo(req);
        const dbresult = (await investmentsDao.getOrderHistory(user)).rows;
        const result = JSON.parse(dbresult[0]['fn_get_transaction_history'])
        requestHandler.sendSuccess(res, 'Success', result);
    } catch (error) {
        requestHandler.sendError(req, res, error);
    }
}

async function getEligibleInvestmentForSendmail(req,res,next){

    try{ 
        const investmentTxnDetails = (await investmentsDao.getEligibleInvestments()).rows;
        for (var i = 0; i < investmentTxnDetails.length; i++) {

            const emailResponse = await email.sendEmail(investmentTxnDetails[i]['email'], 4,investmentTxnDetails[i]['name'],investmentTxnDetails[i]['amount']+' '+investmentTxnDetails[i]['currency']);

            if(investmentTxnDetails[i]['device_token']!=null){
            const notifResponse = await firebase.sendNotification(investmentTxnDetails[i]['device_token'],title,message);
            }
        }
        requestHandler.sendSuccess(res, 'Success');
    }catch(error){
        requestHandler.sendError(req, res, error);
    }
}

async function initiateCryptoTxnRequest(req, res, next) {
    try {

        const user = auth.getUserInfo(req);

        const result = (await investmentsDao.insertCryptoTxnLogs(user)).rows;
        var reqid = result[0]['reqid'];
        requestHandler.sendSuccess(res, 'Success', { reqid });
    } catch (error) {
        requestHandler.sendError(req, res, error);
    }
}

async function updateCryptoTxnStatus(req, res, next) {
    try {
        const result = (await investmentsDao.updateCryptoTxnStatus(req.body)).rows;

        requestHandler.sendSuccess(res, 'Success', result);
    } catch (error) {
        requestHandler.sendError(req, res, error);
    }
}
async function pushOnmetaLatestTxn(req, res, next){
    try {
       
       var network="Polygon";

        const response = (await cryptoApiLogs.insertCryptoWebhookOrders(req.body.orderId,req.body.receiverWalletAddress,req.body.status,req.body.currency,'Buy',req.body.fiat,network,req.body.buyTokenSymbol,req.body.createdAt,req.body.transferredAmount,req.body.txnHash,req.body.buyTokenAddress)).rows;

        if(req.body.status==='completed'){

            const response = (await investmentsDao.checkCryptoLogEntry(req.body.orderId)).rows
             
            if(response && response[0]['user_id']){
                const userId = response[0]['user_id'];
                (await investmentsDao.updatePortfolio(req.body.transferredAmount,userId));
                (await investmentsDao.updateInvestmentEntry(userId,response[0]['reqid'],req.body.txnHash,1,req.body.transferredAmount,'INR',response[0]['id'],req.body.transferredAmount));
            }else{
                return requestHandler.sendErrorMsg(res, 'Error', response, 403);
            }
            
        }
        if(!response[0]){
            return requestHandler.sendErrorMsg(res, 'Error', response, 403);
        }
        requestHandler.sendSuccess(res, 'Success', response);
    } catch (error) {
        requestHandler.sendError(req, res, error);
    }
}
module.exports = {getUserPortfolio,getUserDashboard,getCoinData,getOrderHistory,getEligibleInvestmentForSendmail,initiateCryptoTxnRequest,updateCryptoTxnStatus,pushOnmetaLatestTxn}

