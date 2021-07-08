'use strict'

const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('../configs/configs');

const app = express();
app.set('key', config.key);

let token = '';

function createToken(username, password, legalNamePerson){
    const payload = {
        ckeck: true,
        username,
        password,
        legalNamePerson
    }

    token = jwt.sign(payload, app.get('key'));

    if(token != ''){
        return token
    }
}

module.exports = {createToken}