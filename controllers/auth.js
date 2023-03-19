//import crypto from 'crypto-random-string';

const usersDao = require('../dao/users');
const investmentsDao = require('../dao/investments.js');
// const wallet = require('../controllers/wallet.js');
// const userCryptoDepositWalletAddresses = require('../dao/userCryptoDepositWalletAddresses.js');
const RequestHandler = require('../utils/RequestHandler');
const config = require('../config/appconfig');
const jwt = require('jsonwebtoken');
const Logger = require('../utils/logger');
const auth = require('../utils/auth');
const email = require('../utils/email');
// const common = require('../utils/common');
// const hubspot = require('@hubspot/api-client');
const logger = new Logger();
const requestHandler = new RequestHandler(logger);
const {Str} = require('@supercharge/strings')
// let referralCodeGenerator = require('referral-code-generator');

const { db } = require('../utils/dbconfig.js');

async function signup(req, res, next) {

    try {

        await db.query('BEGIN');

        const dbresult = await usersDao.get(req.body);
        var userdata = dbresult.rows;


        let is_verified = false;
        if (userdata[0]) {
            is_verified = userdata[0]['is_verified'];

            if (userdata[0]['is_deleted']) {
                return requestHandler.sendSuccess(res, 'Your account is deleted.Please contact with growspace support', userdata[0], 400);
            }
            if (userdata[0]['email'] != null) {
                return requestHandler.sendSuccess(res, 'User already exists', {}, 400);
            }
        }

        const encryptPass = await auth.isEncryptPass(req.body.password);

        const emailToken = Str.random(16);

        if (!userdata[0]) {
            userdata = (await usersDao.create(req.body, encryptPass)).rows;
        }
        console.log(userdata[0]);


        if (userdata[0]['id'] == '' || userdata[0]['id'] == null) {
            return requestHandler.sendErrorMsg(res, "Something Went Wrong!");
        }

        if (!is_verified) {
            const tokenResult = await usersDao.createVerificationToken(userdata[0]['id'], emailToken);
            const tokenInfo = tokenResult.rows;

            if (tokenInfo[0]['id'] == null) {
                return requestHandler.sendErrorMsg(res, "Something Went Wrong!");
            }
            // const emailResponse = await email.sendVerificationEmail(userdata[0]['email'], emailToken);
            console.log("Email Response is :", emailToken);
        }

        // let referral_code = referralCodeGenerator.alpha('uppercase', 5);
        // await referrals.createReferralCode(userdata, referral_code);
        const result = { userdetails: userdata[0] };
        await db.query('COMMIT');
        requestHandler.sendSuccess(res, 'User Registered Successfully and sent verification link on mail. Please verify your email.', result);
    } catch (error) {
        await db.query('ROLLBACK');
        requestHandler.sendError(req, res, error);
    }
    // finally {
    //     db.release();
    //   }
}

async function login(req, res, next) {

    try {
        const userdata = (await usersDao.get(req.body)).rows;

        if (!userdata[0]) {
            return requestHandler.sendSuccess(res, 'Email not exists.Please registered first!', userdata[0], 400);
        }

        if (!userdata[0]['password']) {
            return requestHandler.sendSuccess(res, 'Password is not generated.Please reset your password!', null, 400);
        }

        const isCompare = await auth.isComparePass(req.body.password, userdata[0]['password']);

        if (!isCompare) {
            return requestHandler.sendSuccess(res, 'Password is incorrect.Please check again!', null, 400);
        }
        if (!userdata[0]['is_verified']) {
            return requestHandler.sendSuccess(res, 'Email is not verified.Please verify your email.', null, 400);
        }

        // const walletAddress = (await userCryptoDepositWalletAddresses.getCryptoAddress(userdata[0]['id'])).rows;

        // if(!walletAddress[0]){
        //     await wallet.generateDepositAddress(userdata[0]['id'],userdata[0]['email']);
        // }

        //  const last_login_date = new Date();

        const token = jwt.sign({ data: userdata }, config.auth.jwt_secret, { expiresIn: config.auth.jwt_expiresin, algorithm: 'HS512' });

        //get App version
        const appVersion = auth.getHeaderParams(req);
        await usersDao.updateLoginInfo(req.body, appVersion);
        const result = { authToken: token, user_details: userdata[0] };
        requestHandler.sendSuccess(res, 'User logged in Successfully', result);
    } catch (error) {
        requestHandler.sendError(req, res, error);
    }
}

async function googleLogin(req, res, next) {
    try {
        const dbresult = await usersDao.get(req.body);
        var userdata = dbresult.rows;

        if (!userdata[0]) {
            const user = await usersDao.createGoogleAccount(req.body);
            userdata = user.rows;
            if (userdata[0]['id'] == '' || userdata[0]['id'] == null) {
                return requestHandler.sendErrorMsg(res, "Something Went Wrong!");
            }
        }

        // const referralResult = (await referrals.getReferralCode(userdata)).rows;
        // const referralDetails = JSON.parse(referralResult[0]['fn_get_referral_details']);
        // if (referralDetails == null) {
        //     /* a unique referral code the user can share */
        //     let referral_code = referralCodeGenerator.alpha('uppercase', 5);
        //     // console.log("referral_code", referral_code);

        //     await referrals.createReferralCode(userdata, referral_code);
        // }

        // const walletAddress = (await userCryptoDepositWalletAddresses.getCryptoAddress(userdata[0]['id'])).rows;

        // if(!walletAddress[0]){
        //     await wallet.generateDepositAddress(userdata[0]['id'],userdata[0]['email']);
        // }

        const token = jwt.sign({ data: userdata }, config.auth.jwt_secret, { expiresIn: config.auth.jwt_expiresin, algorithm: 'HS512' });

        //get App version
        const appVersion = auth.getHeaderParams(req);
        await usersDao.updateLoginInfo(req.body, appVersion);
        const result = { authToken: token, userdetails: userdata[0] };
        requestHandler.sendSuccess(res, 'Google logged in Successfully', result);
    } catch (error) {
        requestHandler.sendError(req, res, error);
    }
}


async function appleLogin(req, res, next) {
    try {

        if (req.body.email == null || req.body.email == 'null' || req.body.email == '') {
            return requestHandler.sendErrorMsg(res, "Email Is Not Exists!");
        }

        const dbresult = await usersDao.get(req.body);
        var userdata = dbresult.rows;

        if (!userdata[0]) {
            const user = await usersDao.createAppleAccount(req.body);
            userdata = user.rows;
            if (userdata[0]['id'] == '' || userdata[0]['id'] == null) {
                return requestHandler.sendError(req, res, error);
            }
        }

        // const referralResult = (await referrals.getReferralCode(userdata)).rows;
        // const referralDetails = JSON.parse(referralResult[0]['fn_get_referral_details']);
        // if (referralDetails == null) {
        //     /* a unique referral code the user can share */
        //     let referral_code = referralCodeGenerator.alpha('uppercase', 5);
        //     // console.log("referral_code", referral_code);

        //     await referrals.createReferralCode(userdata, referral_code);
        // }
        // const walletAddress = (await userCryptoDepositWalletAddresses.getCryptoAddress(userdata[0]['id'])).rows;

        // if(!walletAddress[0]){
        //     await wallet.generateDepositAddress(userdata[0]['id'],userdata[0]['email']);
        // }

        const token = jwt.sign({ data: userdata }, config.auth.jwt_secret, { expiresIn: config.auth.jwt_expiresin, algorithm: 'HS512' });

        //get App version
        const appVersion = auth.getHeaderParams(req);
        await usersDao.updateLoginInfo(req.body, appVersion);
        const result = { authToken: token, userdetails: userdata[0] };
        requestHandler.sendSuccess(res, 'Apple logged in Successfully', result);
    } catch (error) {
        requestHandler.sendError(req, res, error);
    }
}

async function emailVerification(req, res) {
    try {
        const dbresult = await usersDao.get(req.query);
        var userdata = dbresult.rows;
        console.log('Data :', userdata);

        if (!userdata[0]['email']) {
            return requestHandler.sendSuccess(res, 'Email not found', null, 403);
        }
        if (userdata[0]['is_verified']) {
            return requestHandler.sendSuccess(res, 'Email Already Verified', null, 402);
        }
        const tokenRes = await usersDao.verifyToken(userdata[0]['id'], req.query.token);
        const tokenInfo = tokenRes.rows;
       
        if (!tokenInfo[0]['token']) {
            return requestHandler.sendSuccess(res, 'Token expired', null, 403);
        }
        await usersDao.updateTokenStatus(tokenInfo[0]['id']);
        await usersDao.updateVerifiedFlag(userdata[0]['id']);

        // await wallet.generateDepositAddress(userdata[0]['id'],userdata[0]['email']);
        // await email.sendEmail(userdata[0]['email'], 1, userdata[0]['name']);

        token = jwt.sign({ data: userdata }, config.auth.jwt_secret, { expiresIn: config.auth.jwt_expiresin, algorithm: 'HS512' });
        await usersDao.updateLoginInfo(req.query);
        const result = { authToken: token, userdetails: userdata[0] };
        requestHandler.sendSuccess(res, `User with ${userdata[0]['email']} has been verified`, result);
    } catch (error) {
        requestHandler.sendError(req, res, error);
    }

}

async function logout(req, res, next) {
    try {
        const user = auth.getUserInfo(req);
        console.log('User Data:', user);
        await usersDao.logout(user);
        requestHandler.sendSuccess(res, 'User logged out Successfully');
    } catch (error) {
        requestHandler.sendError(req, res, error);
    }

}

async function forgotPassword(req, res, next) {
    try {
        console.log('Request Body is:', req.body);
        const dbresult = await usersDao.get(req.body);
        var userdata = dbresult.rows;
        console.log('Data :', userdata);

        if (!userdata[0]) {
            return requestHandler.sendSuccess(res, 'User Not registered', userdata[0], 400);
        }
        // const to_eamil = 'pawansinghal150@gmail.com';

        // const randomString = common.getRandomInt(100000, 999999);
        // const subject = 'Sending with SendGrid is Fun';
        // const textContent = `please consider the following as your password${randomString}`;
        // const htmlContent = `<p style="font-size: 32px;">Hello </p>  please consider the following as your password: ${randomString}`;



        // const otpSentTime = new Date();

        // const otpresult = await usersDao.insertOtp(req.body.email, randomString, otpSentTime);
        // const emailResponse = email.sendSingleEmail(config.sendgrid.from_email, req.body.email, subject, textContent, htmlContent);

        const emailToken = Str.random(16);
        console.log("Email Response is :", emailToken);


        const tokenResult = await usersDao.createVerificationToken(userdata[0]['id'], emailToken);
        const tokenInfo = tokenResult.rows;

        if (tokenInfo[0]['id'] == null) {
            return requestHandler.sendError(req, res, error);
        }

        // const emailResponse = await email.sendPasswordResetEmail(userdata[0]['email'], emailToken);

        requestHandler.sendSuccess(res, 'Password Reset Link Send Successfully',{} );
    } catch (error) {
        requestHandler.sendError(req, res, error);
    }

}

async function resetPassword(req, res) {
    try {
        var dbresult = await usersDao.get(req.body);
        var userdata = dbresult.rows;

        if (!userdata[0]['email']) {
            return requestHandler.sendSuccess(res, 'Email not found', userdata[0], 403);
        }
        // if (userdata[0]['is_verified']) {
        //     requestHandler.sendSuccess(res, 'Email Already Verified', userdata[0], 402);
        // }
        const tokenRes = await usersDao.verifyToken(userdata[0]['id'], req.body.token);
        const tokenInfo = tokenRes.rows;

        if (!tokenInfo[0]) {
            return requestHandler.sendSuccess(res, 'Token expired', userdata[0], 403);
        }
        await usersDao.updateTokenStatus(tokenInfo[0]['id']);

        const encryptPass = await auth.isEncryptPass(req.body.password);

        dbresult = await usersDao.resetPassword(req.body, encryptPass);
        var userdata = dbresult.rows;

        if (!userdata[0]) {
            return requestHandler.sendSuccess(res, 'Invalid password', userdata[0], 400);
        }

        requestHandler.sendSuccess(res, 'Password Changed Successfully');
    } catch (error) {
        requestHandler.sendError(req, res, error);
    }

}

/*async function forgotPassword(req,res,next){
    try{
        console.log('Request Body is:',req.body);
        const dbresult = await usersDao.get(req.body);
        var userdata = dbresult.rows;
        console.log('Data :',userdata);
    
        if(!userdata[0]){
            requestHandler.sendSuccess(res, 'User Not registered',userdata[0],400);
        }
        const to_eamil = 'pawansinghal150@gmail.com';
        
        const randomString = common.getRandomInt(100000,999999);
        const  subject = 'Growspace : Forgot Password Otp';
        const  textContent = `please consider the following as your otp${randomString}`;
        const  htmlContent = `please consider the following as your otp: ${randomString}`;



        const otpSentTime = new Date();
    
        const otpresult = await usersDao.insertOtp(req.body.email,randomString,otpSentTime);
        const emailResponse = email.sendSingleEmail(config.sendgrid.from_email,req.body.email,subject,textContent,htmlContent);

        requestHandler.sendSuccess(res, 'Otp Send Successfully',emailResponse);
    }catch(error){
        requestHandler.sendError(req, res, error);
    }

}*/

async function verifyOtp(req, res, next) {
    try {
        console.log('Request Body is:', req.body);
        const dbresult = await usersDao.verifyOtp(req.body);
        var userdata = dbresult.rows;
        console.log('Data :', userdata);

        if (!userdata[0]) {
            return requestHandler.sendSuccess(res, 'Invalid Otp', userdata[0], 400);
        }

        requestHandler.sendSuccess(res, 'Otp Verify Successfully', userdata);
    } catch (error) {
        requestHandler.sendError(req, res, error);
    }

}

async function changePassword(req, res, next) {
    try {
        const user = auth.getUserInfo(req);

        const userdata = (await usersDao.getInfoWrtId(user)).rows;

        const isCompare = await auth.isComparePass(req.body.oldPassword, userdata[0]['password']);

        if (!isCompare) {
            return requestHandler.sendSuccess(res, 'Password is incorrect.Please check again!', null, 400);
        }

        const encryptPass = await auth.isEncryptPass(req.body.newPassword);

        const result = (await usersDao.changePassword(user, encryptPass)).rows;

        if (!result[0]) {
            return requestHandler.sendSuccess(res, 'Something wrong!', result[0], 400);
        }

        requestHandler.sendSuccess(res, 'Password Changed Successfully');
    } catch (error) {
        requestHandler.sendError(req, res, error);
    }

}

async function changeEmail(req, res, next) {
    try {
        const user = auth.getUserInfo(req);
        const userdata = (await usersDao.changeEmail(user, req.body)).rows;

        if (!userdata[0]) {
            return requestHandler.sendSuccess(res, 'Invalid Email', userdata[0], 400);
        }

        requestHandler.sendSuccess(res, 'Email Changed Successfully');
    } catch (error) {
        requestHandler.sendError(req, res, error);
    }

}

async function deleteAccount(req, res, next) {
    try {
        const userdata = auth.getUserInfo(req);

        // const userdata = (await usersDao.getInfoWrtId(user)).rows;

        const isCompare = await auth.isComparePass(req.body.password, userdata[0]['password']);

        if (!isCompare) {
            return requestHandler.sendSuccess(res, 'Password is incorrect.Please check again!', null, 400);
        }

        (await usersDao.deleteAccount(userdata, req.body)).rows;

        requestHandler.sendSuccess(res, 'Delete Your Account Successfully');
    } catch (error) {
        requestHandler.sendError(req, res, error);
    }

}

async function updateUserDetails(req, res, next) {
    try {
        const user = auth.getUserInfo(req);
        const userdata = (await usersDao.updateUserInfo(user, req.body)).rows;

        console.log(userdata);

        if (!userdata[0]) {
            return requestHandler.sendSuccess(res, 'Invalid User Details', userdata[0], 400);
        }

        //console.log("length",(req.body.referalCode).length);
        // if (req.body.referalCode != null && req.body.referalCode != '' && (req.body.referalCode).length > 1) {
        //     await referrals.updateReferrer(user, req.body.referalCode);
        // }

        requestHandler.sendSuccess(res, 'Profile Update Successfully.');
    } catch (error) {
        requestHandler.sendError(req, res, error);
    }

}

async function updateOnboardedViewedFlag(req, res, next) {
    try {
        const user = auth.getUserInfo(req);
        (await usersDao.updateOnboardedViewedFlag(user, req.body)).rows;

        requestHandler.sendSuccess(res, 'Success.');
    } catch (error) {
        requestHandler.sendError(req, res, error);
    }

}


module.exports = { signup, login, logout, googleLogin,emailVerification, forgotPassword, verifyOtp, changePassword, resetPassword, changeEmail, deleteAccount, appleLogin, updateUserDetails, updateOnboardedViewedFlag }

