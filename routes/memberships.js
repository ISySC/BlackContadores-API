'use strict'

var express = require('express')
var router = express.Router()

var mssql = require('mssql')
var sqlConnect = require('../dbase/dbConfig')

var conekta = require('conekta');
conekta.api_key = 'key_THEXVyarQFRAkMmoLJbpGw'; //  <-- Mock private key, please use YOUR personal private key
conekta.api_version = '2.0.0';

router.get('/api/memberships/getmembershiplist', function(request, response){
    mssql.connect(sqlConnect.dbconnection()).then(() => {
        return new mssql.Request().execute("Usp_API_CatalogoMembresiasRecuperar")
    }).then(result => {
        
        console.log(result.recordset)
        response.status(200).send(result.recordset)

        return mssql.close()
    }).catch(error => {
        response.status(500).send('Ocurrio un error al intentar conectarse con el servicio. Intente mas tarde.')
        return mssql.close()
    })
})

router.post('/api/createCustomer', function(req, res){
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


