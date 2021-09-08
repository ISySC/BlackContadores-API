'use strict'

var express = require('express')
var router = express.Router()

var mssql = require('mssql')
var sqlConnect = require('../dbase/dbConfig')

var conekta = require('conekta');
conekta.api_key = 'key_THEXVyarQFRAkMmoLJbpGw'; //  <-- Mock private key, please use YOUR personal private key
conekta.api_version = '2.0.0';

router.get('/api/memberships/getmembershiplist', function (request, response) {
    
    return new Promise((resolve, reject) => {

        new mssql.ConnectionPool(sqlConnect.dbconnection()).connect().then(pool => {
            return pool.request().execute("Usp_API_CatalogoMembresiasRecuperar")
        }).then(result => {
            mssql.close()
            response.status(200).send(result.recordset)
        }).catch(error => {
            response.status(500).send('Ocurrio un error al intentar conectarse con el servicio. Intente mas tarde.')
           
        })

    })
})

router.post('/api/createCustomer', function (req, res) {
    /*  let customer = conekta.Customer.create({
          name: "Prueba de Raul Juarez",
          email: "desarrollo@isysc.net"
        }, function(err, res) {
            if(err){
              console.log(err);
              return;
            }
            console.log(res.toObject());
        });*/
})

module.exports = router


