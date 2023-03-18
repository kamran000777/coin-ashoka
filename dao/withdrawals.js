const {db} = require('../utils/dbconfig.js');


function insertWithdrawalEntry(userinfo,reqbody){
    // const query = 'insert into withdrawals(user_id,amount) values($1,$2) returning id';
    const query = 'insert into withdrawals(id,amount,account_number,ifsc_code) values($1,$2,$3,$4) returning id';
    return db.query(query,[userinfo[0]['id'],reqbody.amount,reqbody.accountNumber,reqbody.ifscCode]);
}

function checkAnyPendingWithDrawEntry(userinfo){
    const query = 'select * from withdrawals where id=$1 and update_time is null order by entrytime desc limit 1';
    return db.query(query,[userinfo[0]['id']]);
}

function updateWithdrawStatus(id){
    const query = 'update withdrawals set update_time=now(),status=$2 where id=$1 and update_time is null';
    return db.query(query,[id,status]);
}

module.exports = {insertWithdrawalEntry,checkAnyPendingWithDrawEntry,updateWithdrawStatus}