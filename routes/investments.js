const router = require('express').Router();
const investmentsController = require('../controllers/investments.js');
const auth = require('../utils/auth');

 router.post('/getUserPortfolio',auth.isAuthunticated,investmentsController.getUserPortfolio);
 router.get('/getCoinData',auth.isAuthunticated,investmentsController.getCoinData);
router.get('/getUserDashboard',auth.isAuthunticated,investmentsController.getUserDashboard);
router.get('/getOrderHistory',auth.isAuthunticated,investmentsController.getOrderHistory);
router.get('/initiateCryptoTxnRequest',auth.isAuthunticated,investmentsController.initiateCryptoTxnRequest);
router.post('/updateCryptoTxnStatus',investmentsController.updateCryptoTxnStatus);
router.post('/pushOnmetaLatestTxn',investmentsController.pushOnmetaLatestTxn);

module.exports = router;
