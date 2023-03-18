const router = require('express').Router();
// const usersRoutes = require('./users');
const authRoutes = require('./auth');
const walletRoutes = require('./wallet');
// const kycRoutes = require('./kyc');
const investmentRoutes = require('./investments');
const faqRoutes = require('./faq');
// const queriesRoutes = require('./queries');
// const insightsRoutes = require('./insights');
// const notificationsRoutes = require('./notifications');
// const testRoutes = require('./test');
// const cryptoApisRoutes = require('./cryptoApis.js');
// const referralsRoutes = require('./referrals.js');
// const commonRoutes = require('./common.js');
// const tokenApisRoutes = require('./tokenApis.js');

router.get('/test',(req,res,next) =>{
    return res.send('routes working');
})

// router.use('/users',usersRoutes);
router.use('/auth',authRoutes);
router.use('/wallet',walletRoutes);
router.use('/investments',investmentRoutes);
// router.use('/kyc',kycRoutes);
router.use('/faq',faqRoutes);
// router.use('/queries',queriesRoutes);
// router.use('/insights',insightsRoutes);
// router.use('/notifications',notificationsRoutes);
// router.use('/test',testRoutes);
// router.use('/cryptoApis',cryptoApisRoutes);
// router.use('/referrals',referralsRoutes);
// router.use('/common',commonRoutes);
// router.use('/tokenApis',tokenApisRoutes);

module.exports = router;