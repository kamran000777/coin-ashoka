const express = require('express');
const bodyParser = require('body-parser');
const cron = require('node-cron');
const routes = require('./routes');
const users = require('./controllers/users.js');

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

if (port == 3000) {

    // 10 minute Cron Job for get latest crypto prices
    cron.schedule('0 */10 * * * *', () => {
        //console.log('running a task every 10 minute');
        users.getCryptoCoinLatestPrices();
    });
}

