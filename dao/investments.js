const {db} = require('../utils/dbconfig.js');

function getUserPortfolio(dataparam){
    const query = 'select * from public.fn_get_user_portfolio($1)';
    return db.query(query,[dataparam[0]['id']]);
};

function getUserDashboardData(dataparam){
    // const query = 'select * from public.fn_get_user_portfolio_latest_wrt_global_13_oct($1)';
    const query = 'select * from users where id=$1';
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

module.exports = {getUserPortfolio,getUserDashboardData,getSingleCoinData,getOrderHistory,getEligibleInvestments}