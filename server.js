'use strict'

const express = require('express');
const fs = require('fs');
//const https = require('https');
const http = require('http')
const app = express();
const port = process.env.PORT || 3003;

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, access-token");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    next();
});

//routes
const membershipsRoute = require('./routes/memberships')
const accountRoute = require('./routes/account')
const companyRoute = require('./routes/company')
const profile = require('./routes/profile')
const user = require('./routes/user')
const payment = require('./routes/payment')

app.use(membershipsRoute)
app.use(accountRoute)
app.use(companyRoute)
app.use(profile)
app.use(user)
app.use(payment)

//configuración para SSL 
//const privateKey = fs.readFileSync( '/etc/letsencrypt/live/www.blacksystem.mx/privkey.pem' );
//const certificate = fs.readFileSync( '/etc/letsencrypt/live/www.blacksystem.mx/fullchain.pem' );

/*https.createServer({
            key: privateKey,
            cert: certificate
}, app).listen(port);*/
var server = app.listen(port, function () {
    console.log('Server running on port:', port)
})
