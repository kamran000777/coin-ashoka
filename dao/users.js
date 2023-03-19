const {db} = require('../utils/dbconfig.js');


function get(dataparam){
    const query = 'SELECT * from users where lower(email)=lower($1) and is_deleted is false';
    return db.query(query,[dataparam.email]);
};

function getInfoWrtId(userinfo){
    const query = 'SELECT * from users where id=$1';
    return db.query(query,[userinfo[0]['id']]);
};

function updateLoginInfo(reqBody,appVersion=null){
    const query = 'update users set is_login=true ,device_token=$2,app_version=$3 where email=$1';
    return db.query(query,[reqBody.email,reqBody.deviceToken,appVersion]);
}

function getUserProfile(userinfo){
    const query = 'select * from public.fn_get_user_profile_wrt_global_04_0ct($1)';
    return db.query(query,[userinfo[0]['id']]);
};

function getWrtPwd(dataparam){
    const query = 'SELECT * from users where email=$1 and password=$2 and is_deleted is false';
    return db.query(query,[dataparam.email,dataparam.password]);
};

function create(dataparam,encryptPass){
    const query = 'insert into users(email,password) values($1,$2) returning *';
    return db.query(query,[dataparam.email,encryptPass]);
};

function createVerificationToken(userId,emailToken){
    const query = 'insert into verification_tokens(id,token) values($1,$2) returning *';
    return db.query(query,[userId,emailToken]);
};

function verifyToken(userId,emailToken){
    const query = "select * from verification_tokens where id=$1 and token=$2 and entrytime>now() - interval '1 days' and update_time is null order by id desc limit 1";
    return db.query(query,[userId,emailToken]);
};

function verifyWithdrawalOtp(userId,otp){
    const query = "select * from verification_tokens where user_id=$1 and token=$2 and entrytime>now() - interval '5 minute' and update_time is null order by id desc limit 1";
    return db.query(query,[userId,otp]);
};

function updateVerifiedFlag(userId){
    const query = 'update users set is_verified=true where id=$1 returning id';
    return db.query(query,[userId]);
}

function updateTokenStatus(rowId){
    const query = 'update verification_tokens set update_time=now() where id=$1 returning id';
    return db.query(query,[rowId]);
}

function insertOtp(email,otp,otpSentTime){
    const query = 'update users set otp=$2 ,otp_sent_time=$3 where email=$1 returning *';
    return db.query(query,[email,otp,otpSentTime]);
}

function verifyOtp(dataparam){
    const query = 'SELECT * from users where email=$1 and otp=$2';
    return db.query(query,[dataparam.email,dataparam.otp]);
};

function createGoogleAccount(dataparam){
    const query = 'insert into users(email,is_google_login,is_verified) values($1,$2,true) returning *';
    return db.query(query,[dataparam.email,dataparam.is_google_login]);
};

function createAppleAccount(dataparam){
    const query = 'insert into users(email,is_apple_login,is_verified) values($1,$2,true) returning *';
    return db.query(query,[dataparam.email,dataparam.is_apple_login]);
};

function resetPassword(dataparam,encryptPass){
    const query = 'update users set password=$2 where email=$1 returning id';
    return db.query(query,[dataparam.email,encryptPass]);
}


function clearEntryFromVerificationToken(userId){
    const query = 'DELETE FROM verification_tokens WHERE id=$1';
    return db.query(query,[userId]);
}

function changePassword(userinfo,encryptPass){
    const query = 'update users set password=$2 where id=$1 returning id';
    return db.query(query,[userinfo[0]['id'],encryptPass]);
}

function changeEmail(userinfo,reqbody){
    const query = 'update users set email=$3 where id=$1 and email=$2 and password=$4 returning id';
    return db.query(query,[userinfo[0]['id'],userinfo[0]['email'],reqbody.newEmail,reqbody.password]);
}

function deleteAccount(userinfo,reqbody){
    const query = 'update users set is_deleted=true,reason=$2 where id=$1 returning id';
    return db.query(query,[userinfo[0]['id'],reqbody.reason]);
}

function logout(dataparam){
    console.log("user id",dataparam[0]['id']);
    const query = 'update users set is_login=false where id=$1';
    return db.query(query,[dataparam[0]['id']]);
};

function updateSipAmount(userinfo,reqbody){
    const query = 'update users set current_investment_plan=$2 where id=$1 returning *';
    console.log("Users Details :",query);
    return db.query(query,[userinfo[0]['id'],reqbody.amount]);
}

function updateProfileImage(userinfo,url){
    const query = 'update users set profile_image = $2 where id=$1 returning id';
    console.log("Users Details :",query);
    return db.query(query,[userinfo[0]['id'],url]);
}

function updateAadhar(userinfo,front_url,back_url){
    const query = 'update users set idproof_front = $2 ,idproof_back = $3 where id=$1 returning id';
    console.log("Users Details :",query);
    return db.query(query,[userinfo[0]['id'],front_url,back_url]);
}

function updatePan(userinfo,url,pan_name){
    const query = 'update users set pan = $2,pan_name=$3 where id=$1 returning id';
    console.log("Users Details :",query);
    return db.query(query,[userinfo[0]['id'],url,pan_name]);
}

function updateInvestmentTableEntry(userinfo){
    const query = 'update users set is_invesment_table_created=true where id=$1';
    return db.query(query,[userinfo[0]['id']]);
}

// function updatePan(userinfo,pan_name){
//     console.log("Pan name ",pan_name);
//     const query = 'update users set pan_name=$2 where id=$1 returning id';
//     console.log("Users Details :",query);
//     return db.query(query,[userinfo[0]['id'],pan_name]);
// }

function insertBankDetails(userinfo,reqbody,bankHolderName){
    const query = 'insert into user_bank_details(user_id,account_no,account_holder_name,ifsc_code) values($1,$2,$3,$4) returning id';
    console.log("Users Details :",query);
    return db.query(query,[userinfo[0]['id'],reqbody.accountNumber,bankHolderName,reqbody.ifsc]);
}

function getKycStatus(userinfo){
    const query = "select (case when profile_image is null then 'Selfie Pending' when pan is null then 'Pan Pending' when idproof_front is null or idproof_back is null then 'Aadhar Pending' when (select count(1) from user_bank_details ubd where user_id = u.id)=0 then 'Bank Pending'  else 'success' end) as kyc_status from users u where u.id=$1";
    console.log("Users Details :",query);
    return db.query(query,[userinfo[0]['id']]);
}

function updateKyc(userinfo){
    const query = 'update users set is_kyc=true,kyc_verified_time=now() where id=$1 returning id,is_kyc';
    console.log("Users Details :",query);
    return db.query(query,[userinfo[0]['id']]);
}

function getAllUsers(){
    const query = "SELECT * from users where email in ('shrikant.sawant@gmail.com','hdoval@gmail.com','kumarravi2104@gmail.com','aditya_gupta1@outlook.com','tarunsinghal1812@gmail.com','swastik.bhanawat@gmail.com','jn.sanchit@gmail.com','raygstephanos@gmail.com')";
    return db.query(query);
};

function updateUserInfo(userinfo,reqBody){
    // const query = 'update users set name= $2 , mobileno = $3 , country_code = $4 ,profile_image = $5, occupation = $6 where id=$1 returning id';
    const query = 'update users set name= $2 , mobileno = $3 , country_code = $4 where id=$1 returning id';
    return db.query(query,[userinfo[0]['id'],reqBody.name,reqBody.mobileno,reqBody.cc]);
}

function updateOnboardedViewedFlag(userinfo,reqBody){
    const query = 'update users set has_onboarded_viewed= $2 where id=$1 returning id';
    return db.query(query,[userinfo[0]['id'],reqBody.hasOnboardedViewed]);
}

function updateIsPledge(userinfo,isPledge){
    const query = 'update users set is_pledge = $2 where id=$1 returning id';
    return db.query(query,[userinfo[0]['id'],isPledge]);
}

module.exports = {get,create,logout,getWrtPwd,createGoogleAccount,createVerificationToken,insertOtp,verifyOtp,changePassword,
    verifyToken,updateTokenStatus,updateSipAmount,updateProfileImage,updateAadhar,updatePan,insertBankDetails,getInfoWrtId,updateKyc,
    updateVerifiedFlag,getUserProfile,clearEntryFromVerificationToken,resetPassword,changeEmail,deleteAccount,updateLoginInfo,getKycStatus,getAllUsers,verifyWithdrawalOtp,
     createAppleAccount, updateUserInfo,updateIsPledge,updateOnboardedViewedFlag,updateInvestmentTableEntry}