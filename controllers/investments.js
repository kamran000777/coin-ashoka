const investmentsDao = require('../dao/investments.js');
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
        requestHandler.sendSuccess(res, 'Success',JSON.parse(result[0]['fn_get_user_portfolio']));
    }catch(error){
        requestHandler.sendError(req, res, error);
    }
}

async function getUserDashboard(req,res,next){

    try{
        const user = auth.getUserInfo(req);  
        const result = (await investmentsDao.getUserDashboardData(user)).rows;
        // const result = JSON.parse(dbresult[0]['fn_get_user_portfolio_latest_wrt_global_13_oct']);
  
        const data = {user_details:result[0]};
        console.log(data);

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
        const result = JSON.parse(dbresult[0]['fn_get_order_history_wrt_user_global_04_oct']);
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
            console.log("Email Response:",emailResponse);

            if(investmentTxnDetails[i]['device_token']!=null){
            const notifResponse = await firebase.sendNotification(investmentTxnDetails[i]['device_token'],title,message);
            console.log("Notification Response:",notifResponse);
            }
        }
        requestHandler.sendSuccess(res, 'Success');
    }catch(error){
        requestHandler.sendError(req, res, error);
    }
}

module.exports = {getUserPortfolio,getUserDashboard,getCoinData,getOrderHistory,getEligibleInvestmentForSendmail}

