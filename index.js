const express = require('express');
const bodyParser = require('body-parser');
// const cron = require('node-cron');
const routes = require('./routes');


const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res, next) => {
    res.send('Working');
})


//   CROS Configuiration
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

// app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));

app.use('/api/v1', routes);

const port = process.env.APP_PORT || 3000;
app.listen(port, (err) => {
    if (err) {
        console.log('Server Error: ', err);
        return;
    }
    console.log('App listening on port : ' + port);
}

)

// cron.schedule('*/10 * * * * *', () => {
//     //console.log('running a task every 1 hour');
//     users.getCryptoCoinLatestPrices();
// });

// if (port == 3001) {
//     //60 minute cron job for latest currency prices
//     cron.schedule('0 0 */8 * * *', () => {
//         //console.log('running a task every 1 hour');
//         common.getCurrenciesData();
//     });
// }
// if (port == 3001) {
//     // 10 minute Cron Job for get latest crypto prices
//     cron.schedule('0 */10 * * * *', () => {
//         //console.log('running a task every 10 minute');
//         users.getCryptoCoinLatestPrices();
//     });

//      //1 minute cron job for referral reward
//     cron.schedule('0 */1 * * * *', () => {
//         //console.log('running a task every 1 minute');
//         referrals.runReferralRewardProcess();
//     });

//     //60 minute cron job for latest currency prices
//     cron.schedule('0 0 */8 * * *', () => {
//         //console.log('running a task every 1 minute');
//         common.getCurrenciesData();
//     });

//     // 10 second Cron Job
//     // cron.schedule('0 */10 * * * *', () => {
//     //     console.log('running a task every 10 minute');
//     //     users.getCryptoCoinHistoryPricesAuto();
//     // });
// }

