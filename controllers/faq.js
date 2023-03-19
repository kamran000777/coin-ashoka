const faqDao = require('../dao/faq.js');
const RequestHandler = require('../utils/RequestHandler');
const Logger = require('../utils/logger');
const logger = new Logger();
const requestHandler = new RequestHandler(logger);


async function getFaqData(req, res) {
    try {
        const result =  faqDao.faq;
        requestHandler.sendSuccess(res, 'Success', result);
    } catch (error) {
        requestHandler.sendError(req, res, error);
    }
}

async function getAboutData(req, res) {
    try {
        const result =  faqDao.about;
        console.log("result",result);
        requestHandler.sendSuccess(res, 'Success', result);
    } catch (error) {
        requestHandler.sendError(req, res, error);
    }
}

module.exports = {getFaqData,getAboutData}