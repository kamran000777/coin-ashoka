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

    const query = 'select * from public.fn_get_order_history_wrt_user_global_04_oct($1)';
    return db.query(query,[userinfo[0]['id']]);
}

function getEligibleInvestments(){

    const query = `select u.name,u.email,u.device_token,i.amount,i.quantity,i.entrytime,i.currency from investments i 
    inner join users u on i.user_id = u.id
    where i.entrytime::date = now()::date`;
    return db.query(query);
}


function insertEntryInInvestment(id){
    const query = `insert into investments (user_id,coin_id,amount,quantity,usdc_amount) values ($1,0,0,0,0)`;
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

function updateInvestmentEntry(amount,quantity,usdc_amount,id){
    const query = 'update investments set amount = amount+$1, quantity = quantity+$2, usdc_amount = usdc_amount+$3 where user_id =$4 returning user_id';
    return db.query(query,[amount,quantity,usdc_amount,id]);
}

module.exports = {getUserPortfolio,getUserDashboardData,getSingleCoinData,getOrderHistory,getEligibleInvestments,insertEntryInInvestment,insertCryptoTxnLogs,updateCryptoTxnStatus,updateInvestmentEntry}