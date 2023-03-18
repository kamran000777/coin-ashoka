const router = require('express').Router();
const faqController = require('../controllers/faq.js');

 router.get('/getFaqData',faqController.getFaqData);
 router.get('/about',faqController.getAboutData);

module.exports = router;