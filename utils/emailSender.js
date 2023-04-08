var SibApiV3Sdk = require('sib-api-v3-sdk');
const config = require('../config/appconfig');

var defaultClient = SibApiV3Sdk.ApiClient.instance;

var apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = config.sendgrid.api_key;

const mailer = new SibApiV3Sdk.TransactionalEmailsApi();

const sender = {
    email : config.sendgrid.from_email
}

const sendEmail =(receiver,subject,content)=>{
    mailer.sendTransacEmail(
        {
        sender,
        to:receiver,
        Subject:subject,
        htmlContent:content
        }
    ).then(res=>{
        console.log(res);
    }).catch(res=>{
        console.log(res);
    });
}

module.exports ={sendEmail}