'use strict'

var express = require('express')
var authToken = require('../jwt/jwtoken')

var securityRoute = express.Router();

securityRoute.use((request, response, next) => {
    let accessToken = request.headers['access-token'];

    if (accessToken) {
        if(authToken.validateUserToken(accessToken))
            next()
        else{
            return response.status(200).send({
                success: false,
                message: 'Token no válido',
                response: null
            })
        }
    }
    else {
        response.status(200).send({
            success: false,
            message: 'Token no recibida',
            response: null
        })
    }
})

module.exports = securityRoute