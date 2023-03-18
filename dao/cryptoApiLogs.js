const {db} = require('../utils/dbconfig.js');

function insertCryptoApiLogs(userId,apiName,resbody,blockchain){
    const query = 'insert into crypto_api_logs(user_id,api_name,res_body,blockchain) values($1,$2,$3,$4) returning id';
    return db.query(query,[userId,apiName,resbody,blockchain]);
}

function insertApiCredentials(apiProvider,token,expireTime,refreshToken=null){
    const query = 'insert into api_credentials(api_provider,token,expire_time,refresh_token) values($1,$2,$3,$4) returning id';
    return db.query(query,[apiProvider,token,expireTime,refreshToken]);
}
function updateApiCredentials(apiProvider,token,expireTime){
    const query = 'update api_credentials set token=$2,expire_time=$3 where api_provider=$1';
    return db.query(query,[apiProvider,token,expireTime]);
}
function getApiCredentials(apiProvider){
    const query = 'select token,now()::date as startdate,now()::date as enddate from api_credentials where expire_time > now() and api_provider=$1 order by id desc limit 1';
    return db.query(query,[apiProvider]);
}

function getApiLastToken(apiProvider){
    const query = 'select token from api_credentials where api_provider=$1 order by id desc limit 1';
    return db.query(query,[apiProvider]);
}

function insertCryptoTxnLogs(userinfo,apiProvider,apiName){
    const query = 'insert into crypto_txn_api_logs(user_id,api_provider,api_name) values($1,$2,$3) returning reqid';
    return db.query(query,[userinfo[0]['id'],apiProvider,apiName]);
}

function updateCryptoTxnStatus(resData){
    console.log("response is :",resData);
    const query = 'update crypto_txn_api_logs set res_body= $2,status=$3 where reqid=$1 returning id';
    return db.query(query,[resData.merchantOrderId,resData,resData.paymentStatus]);
}

function insertCryptoOrders(result_array) {

    const query = `select * from ps_save_crypto_orders('${JSON.stringify(result_array)}')`;
    return db.query(query);
}

function insertCryptoWebhookOrders(orderId,walletAddress,status,fiatCurrency,orderType,fiatAmount,network,cryptoCurrency,createdTime,cryptoAmount,walletLink,buyTokenAddress) {

    const query = 'INSERT INTO public.crypto_orders (order_id, wallet_address, status, fiat_currency, order_type, fiat_amount, network,crypto_currency,created_time,crypto_amount,blockchain_txn_hash,buy_token_address) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) returning id';
    return db.query(query,[orderId,walletAddress,status,fiatCurrency,orderType,fiatAmount,network,cryptoCurrency,createdTime,cryptoAmount,walletLink,buyTokenAddress]);
}

function getCryptoPendingOrders() {

    const query = `select * from crypto_orders co where status = 'pending'`;
    return db.query(query);
}

function insertWalletTokenTxns(apiProvider, orderType, serial, orderId, currency, txId, blockHeight, tIndex, voutIndex, amount, fees, memo, broadcastAt, chainAt, fromAddress, toAddress, walletId, state, confirmBlocks, processingState, addon, decimal, currencyBip44, tokenAddress) {

    const query = 'INSERT INTO public.wallet_token_txns(api_provider, order_type, serial, order_id, currency, txid, block_height, tindex, vout_index, amount, fees, memo, broadcast_at, chain_at, from_address, to_address, wallet_id, state, confirm_blocks, processing_state, addon, decimal, currency_bip44, token_address)VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24) returning id';
    return db.query(query,[apiProvider, orderType, serial, orderId, currency, txId, blockHeight, tIndex, voutIndex, amount, fees, memo, broadcastAt, chainAt, fromAddress, toAddress, walletId, state, confirmBlocks, processingState, addon, decimal, currencyBip44, tokenAddress]);
}

function getCryptoTxnDetail(txnId) {

    const query = `select u.name,u.email,u.device_token, to_timestamp(wtt.chain_at) as time ,co.fiat_amount,co.order_id,co.fiat_amount,co.fiat_currency 
    from wallet_token_txns wtt 
    inner join crypto_orders co on wtt.to_address::varchar = co.wallet_address::varchar and wtt.txid::varchar = co.blockchain_txn_hash::varchar
    inner join user_crypto_deposit_wallet_addresses ucdwa on wtt.to_address::varchar=ucdwa.address and ucdwa.blockchain = 'Polygon'
    inner join users u on u.id=ucdwa.user_id 
    where wtt.processing_state=1 and wtt.txid = $1`;
    return db.query(query,[txnId]);
}

module.exports = {insertCryptoApiLogs,insertApiCredentials,getApiCredentials,updateApiCredentials,insertCryptoTxnLogs,insertCryptoOrders,insertCryptoWebhookOrders, getCryptoPendingOrders,updateCryptoTxnStatus, insertWalletTokenTxns,getApiLastToken,getCryptoTxnDetail}