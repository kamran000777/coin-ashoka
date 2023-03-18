const router = require('express').Router();
const walletController = require('../controllers/wallet.js');
const auth = require('../utils/auth');

 router.get('/getUpiId',walletController.getUpiId);
 router.post('/depositeAmount',auth.isAuthunticated,walletController.depositeAmount);
 router.post('/updateSipPlan',auth.isAuthunticated,walletController.updateSipPlan);
 router.post('/withdrawalAmount',auth.isAuthunticated,walletController.withdrawalAmount);
 router.get('/getTxnHistory',auth.isAuthunticated,walletController.getTxnHistory);
 router.post('/generateDepositAddress',auth.isAuthunticated,walletController.generateDepositAddress);
 router.get('/getWalletAddress',auth.isAuthunticated,walletController.getWalletAddress);
 router.get('/getWalletTransactions',auth.isAuthunticated,walletController.getWalletTransactions);
 router.get('/generateDepositAddressTemp',auth.isAuthunticated,walletController.generateDepositAddressTemp);

// router.post('/withdrawalAmount',walletController.withdrawalAmount);
// router.get('/getDepositeStatus',walletController.getDepositeStatus);
// router.get('/getwithdrawalStatus',walletController.getwithdrawalStatus);
// router.get('/getAccountBalance',walletController.getAccountBalance);
// router.get('/getWalletHistory',walletController.getWalletHistory);

module.exports = router;