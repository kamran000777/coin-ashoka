const router = require('express').Router();
const authController = require('../controllers/auth.js');
const auth = require('../utils/auth');

 router.post('/signup',authController.signup);
 router.post('/login',authController.login);
 router.post('/googleLogin',authController.googleLogin);
// // router.post('/validatePin',authController.validatePin);
 router.post('/logout',auth.isAuthunticated,authController.logout);
 router.get('/emailVerification',authController.emailVerification);
 router.post('/forgotPassword',authController.forgotPassword);
 router.post('/verifyOtp',authController.verifyOtp);
 router.post('/changePassword',authController.changePassword);
 router.post('/resetPassword',authController.resetPassword);
//  router.post('/changeEmail',authController.changeEmail);
 router.post('/deleteAccount',authController.deleteAccount);
 router.post('/appleLogin',authController.appleLogin);
 router.post('/updateUserDetails',authController.updateUserDetails);
//  router.post('/updateOnboardedViewedFlag',authController.updateOnboardedViewedFlag);
 
module.exports = router;

