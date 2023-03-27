const withdrawalsDao = require('../dao/withdrawals.js');
const RequestHandler = require('../utils/RequestHandler');
const Logger = require('../utils/logger');
const auth = require('../utils/auth');
const logger = new Logger();
const requestHandler = new RequestHandler(logger);

const { db } = require('../utils/dbconfig.js');

async function depositeAmount(req, res, next) {
    try {
        await db.query('BEGIN');

        const user = auth.getUserInfo(req);

        if (req.body.is_new_investor) {
            var dbresult = await usersDao.updateSipAmount(user, req.body);
        }
        dbresult = await depositsDao.initiateDepositEntry(user, req.body);
        const result = dbresult.rows;
        if (!result[0]) {
            return requestHandler.sendError(req, res, error);
        }
        // if (result[0]['id'] == '' || result[0]['id'] == null) {
        //     requestHandler.sendError(req, res, error);
        // }
        await db.query('COMMIT');
        requestHandler.sendSuccess(res, 'Your transaction is under process and will reflect in your SIP wallet soon.', result);
    } catch (error) {
        await db.query('ROLLBACK');
        requestHandler.sendError(req, res, error);
    }
}

async function withdrawalAmount(req, res, next) {
    try {
        const user = auth.getUserInfo(req);

        const isValidRequest = (await withdrawalsDao.checkAnyPendingWithDrawEntry(user)).rows;
        
        let result;
        if(!isValidRequest[0]){
            result = (await withdrawalsDao.insertWithdrawalEntry(user, req.body)).rows;

            if (!result[0]) {
                return requestHandler.sendError(req, res, error);
            }
            return requestHandler.sendSuccess(res, 'Withdrawal Request Raised Successfully!', result[0]);
        }

        requestHandler.sendSuccess(res, 'There is a pending request!',{},201);
    } catch (error) {
        requestHandler.sendError(req, res, error);
    }
}

function getUpiId(req, res) {
    try {
        const user = auth.getUserInfo(req);
        const result = {"upi_id":"9873683408.ibz@icici"};
        requestHandler.sendSuccess(res, 'Success', result);
    } catch (error) {
        requestHandler.sendError(req, res, error);
    }
}

async function updateSipPlan(req, res) {
    try {
        const user = auth.getUserInfo(req);
        const dbresult = await usersDao.updateSipAmount(user, req.body);
        const result = dbresult.rows;
        if (!result[0]) {
            return requestHandler.sendError(req, res, error);
        }
        requestHandler.sendSuccess(res, 'Success', result);
    } catch (error) {
        requestHandler.sendError(req, res, error);
    }
}

async function getTxnHistory(req, res){
    try {
        const user = auth.getUserInfo(req);
        const dbresult = (await depositsDao.getTxnHistory(user)).rows;
        const result = JSON.parse(dbresult[0]['fn_get_transaction_history_wrt_user']);
        requestHandler.sendSuccess(res, 'Success', result);
    } catch (error) {
        requestHandler.sendError(req, res, error);
    }
}

async function generateDepositAddressTemp(req, res, next) {
    try {

        const user = auth.getUserInfo(req);

        //var body = { "blockchain": "Ethereum", "network": testnet };

        var blockchain = "Polygon";
        var label = user[0]['id']+'-'+blockchain;
        var emailId = user[0]['email'];

        const randomString = common.getRandomInt(100000, 999999);

        var body = { "count": 1,"labels": [
            emailId
        ]};
        var addressResData = await cybavo.generateDepositAddress(body);
        // const result = await cryptoApis.generateDepositAddress(blockchain,label);
        console.log("step 1",addressResData);

         var address = addressResData.addresses[0];
        // var createdTimestamp = common.toDateTime(resBody.data.item.createdTimestamp);
         console.log(address);
         
         const verifyResData = await cybavo.verifyDepositAddress(addressResData);
         console.log("step 11",verifyResData);
         console.log(verifyResData.addresses);
         var addressInfo = verifyResData.addresses;
         console.log(addressInfo[address]);
        //  console.log(addressInfo[address]['create_time']);
         var createdTimestamp = verifyResData.addresses[address]['create_time'];
         console.log(createdTimestamp);
         await cryptoApiLogs.insertCryptoApiLogs(user[0]['id'],'address',addressResData,blockchain);

         await userCryptoDepositWalletAddresses.insertCryptoAddress(user[0]['id'],address,createdTimestamp,blockchain);
        requestHandler.sendSuccess(res, 'Success', addressResData);
    } catch (error) {
        requestHandler.sendError(req, res, error);
    }
}

async function getWalletTransactions(req, res, next) {
    try {

        const user = auth.getUserInfo(req);

        //var body = { "blockchain": "Ethereum", "network": testnet };

        var blockchain = "ethereum";
        var address = "0x6dc15Bb1975A7fbeB0b529F7C76A50Ba4C224163";
        const result = await cryptoApis.walletTransactions(blockchain,address);
        console.log(JSON.parse(result));
        var resBody = JSON.parse(result);
        console.log("item :",resBody.data.items);
        console.log("item 1 :",resBody.data.items[0]);

        var items = resBody.data.items;
        for(var i=0; i<items.length; i++){

            var recipientAddress = items[i].recipients[0].address;
            var senderAddress = items[i].senders[0].address;
            var recipientAmount = items[i].recipients[0].amount;
            var senderAmount = items[i].senders[0].amount;
            var timestamp = items[i].timestamp;
            var transactionId = items[i].transactionId;
            var feeAmount = items[i].fee.amount;
            var feeUnit = items[i].fee.unit;
            console.log("recipient",recipient);
        }
        requestHandler.sendSuccess(res, 'Success', resBody);
    } catch (error) {
        requestHandler.sendError(req, res, error);
    }
}

async function generateDepositAddress(userId,emailId) {

        //var body = { "blockchain": "Ethereum", "network": testnet };

        var blockchain = "Polygon";


        //crypto Apis
        // var label = userId+'-'+blockchain;

        // const result = await cryptoApis.generateDepositAddress(blockchain,label);

        // var resBody = JSON.parse(result);
        // var address = resBody.data.item.address;
        // var createdTimestamp = common.toDateTime(resBody.data.item.createdTimestamp);

        //cybavo apis
        var body = { "count": 1,"labels": [
            emailId
        ]};
        var addressResData = await cybavo.generateDepositAddress(body);
         var address = addressResData.addresses[0];

         console.log("deposit address",address);
         
         const verifyResData = await cybavo.verifyDepositAddress(addressResData);
         console.log("deposit verifyResData",verifyResData);
         var createdTimestamp = new Date(); //verifyResData.addresses[address]['create_time'];

        await cryptoApiLogs.insertCryptoApiLogs(userId,'address',addressResData,blockchain);

        await userCryptoDepositWalletAddresses.insertCryptoAddress(userId,address,createdTimestamp,blockchain);
        return address;
}

async function getWalletAddress(req, res, next) {
    try {

        const user = auth.getUserInfo(req);

        var walletAddress = (await userCryptoDepositWalletAddresses.getCryptoAddress(user[0]['id'])).rows;

        console.log("walletAddress :",walletAddress);
        
        if(!walletAddress[0]){
            console.log("enter walletAddress generate block:",user);
            await generateDepositAddress(user[0]['id'],user[0]['email']);
            walletAddress = (await userCryptoDepositWalletAddresses.getCryptoAddress(user[0]['id'])).rows;
        }
        walletAddress['onramp'] = 'bitbns';
        requestHandler.sendSuccess(res, 'Success', walletAddress);
    } catch (error) {
        requestHandler.sendError(req, res, error);
    }
}

module.exports = { depositeAmount,getUpiId,updateSipPlan,withdrawalAmount,getTxnHistory,generateDepositAddress,generateDepositAddressTemp,getWalletTransactions,getWalletAddress}