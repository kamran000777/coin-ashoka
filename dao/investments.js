const {db} = require('../utils/dbconfig.js');

function getUserPortfolio(dataparam){
    const query = 'select * from public.fn_get_user_portfolio($1)';
    return db.query(query,[dataparam[0]['id']]);
};

function getUserDashboardData(dataparam){
    // const query = 'select * from public.fn_get_user_portfolio_latest_wrt_global_13_oct($1)';
    const query = 'select * from public.get_user_portfolio($1)';
    return db.query(query,[dataparam[0]['id']]);
};

function getSingleCoinData(userinfo,reqParam){
    const query = 'select * from public.fn_get_single_coin_data_wrt_global_27_sept($1,$2,$3::varchar)';
    return db.query(query,[userinfo[0]['id'],reqParam.coinId,reqParam.interval]);
}

function getOrderHistory(userinfo){
    const query = 'select * from public.fn_get_transaction_history($1)';
    return db.query(query,[userinfo[0]['id']]);
}

function getEligibleInvestments(){

    const query = `select u.name,u.email,u.device_token,i.amount,i.quantity,i.entrytime,i.currency from investments i 
    inner join users u on i.user_id = u.id
    where i.entrytime::date = now()::date`;
    return db.query(query);
}


function insertEntryInInvestment(id){
    const query = `insert into investments (user_id,coin_id,amount,quantity,usdc_amount,currency) values ($1,1,0,0,0,'INR')`;
    return db.query(query,[id]);
}


function insertCryptoTxnLogs(userinfo){
    const query = 'insert into crypto_txn_api_logs(user_id) values($1) returning reqid';
    return db.query(query,[userinfo[0]['id']]);
}

function updateCryptoTxnStatus(resData){
    const query = 'update crypto_txn_api_logs set res_body=$2,status=$3 where reqid=$1 returning id';
    return db.query(query,[resData.merchantOrderId,resData,resData.paymentStatus]);
}

function updateInvestmentEntry(id,reqid,tnxId,status,amount,currency,crypto_order_id,usdc_amount){
    const query = `insert into deposits(user_id,reqid,txnid,status,amount,currency,usdt_amount,crypto_order_id,usdc_amount,tnx_type)  values($1,$2,$3,$4,public.get_crypto_quantity($5),$6,0,$7,$8,'Buy') returning user_id`;
    return db.query(query,[id,reqid,tnxId,status,amount,currency,crypto_order_id,usdc_amount]);
}

function updatePortfolio(quantity,id){
    const query = 'update investments set amount=amount+public.get_crypto_quantity($1), quantity=quantity+$1 where user_id=$2 returning user_id';
    return db.query(query,[quantity,id]);
}

function checkCryptoLogEntry(orderId){
  const query = `select id, user_id,reqid from (SELECT id, user_id,reqid,res_body::json->>'orderId' as orderId FROM crypto_txn_api_logs ctal ) AS table_1 where orderId ILIKE $1`;
  return db.query(query,[`%${orderId}%`]);
}

function getUserdetails(email){
    const query = `select id from users u where email ilike $1`;
    return db.query(query,[`%${email}%`]);
}


module.exports = {getUserPortfolio,getUserDashboardData,getSingleCoinData,getOrderHistory,getEligibleInvestments,insertEntryInInvestment,insertCryptoTxnLogs,updateCryptoTxnStatus,updateInvestmentEntry,updatePortfolio,checkCryptoLogEntry,getUserdetails}