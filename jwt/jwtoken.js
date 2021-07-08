'use strict'

const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('../configs/configs');

const app = express();
app.set('key', config.key);

let token = '';

function createToken(username, password){
    const payload = {
        ckeck: true,
        username,
        password
    }

    token = jwt.sign(payload, app.get('key'));

    if(token != ''){
        return token
    }
}

function validateUserToken(accessToken){
    let isTokenUserValid = false;

    jwt.verify(accessToken, app.get('key'), (error, decoded) =>{
        
        if(error)
           isTokenUserValid = false;
        else{
            isTokenUserValid = true;
        }
    })
    
    return isTokenUserValid
}

module.exports = {createToken, validateUserToken}