var admin = require("firebase-admin");

var serviceAccount = require("./coin-ashoka-26bd8-firebase-adminsdk-ix91t-69a34d401d.json");

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

module.exports.admin = admin