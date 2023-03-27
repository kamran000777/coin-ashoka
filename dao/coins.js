
const { db } = require('../utils/dbconfig.js');

function insertLatestCoinPrices(usdc_price) {

    const query = `update coins set price_usdc=$1`;
    return db.query(query,[usdc_price]);
}

function insertHistoryCoinPrices(coin_name, result_array) {

    const query = `select * from ps_save_crypto_market_history_prices('${coin_name}','${result_array}')`;

    return db.query(query);
}

function getAllCoins() {

    const query = 'select * from coins where is_fund is false and is_active is true';
    return db.query(query);
}

function getNcfUnderlineCoins() {

    const query = `select polygon_erc20_token_address,fcic.percentage from coins c 
    inner join fund_coin_intitial_composition fcic on c.id=fcic.coin_id
    where polygon_erc20_token_address is not null and fcic.is_active is true`;
    return db.query(query);
}

module.exports = { insertLatestCoinPrices, insertHistoryCoinPrices,getAllCoins,getNcfUnderlineCoins}