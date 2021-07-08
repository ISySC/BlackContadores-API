'use strict'

const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    next();
});

//routes
const membershipsRoute = require('./routes/memberships')
const accountRoute = require('./routes/account')
const companyRoute = require('./routes/company')

app.use(membershipsRoute)
app.use(accountRoute)
app.use(companyRoute)

var server = app.listen(port, function () {
    console.log('Server running on port:', port)
})

