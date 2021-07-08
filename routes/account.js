'use strict'

var express = require('express')
var router = express.Router()
var bodyParser = require('body-parser')
var authToken = require('../jwt/jwtoken')
var stmp = require("../util/smpt")

var mssql = require('mssql')
var sqlConnect = require('../dbase/dbConfig')

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

router.post('/api/user/createaccount', (request, response) => {
    let legalNamePerson = request.body.legalNamePerson
    let companyName = request.body.companyName
    let email = request.body.email
    let password = request.body.password
    let membershipID = request.body.membershipID
    let frecuency = request.body.frecuency
    let empresaTransID = 0

    mssql.connect(sqlConnect.dbconnection()).then(() => {
        return new mssql.Request()
            .input('NombreUsuario', legalNamePerson)
            .input('CorreoUsuario', email)
            .input('Contrasena', password)
            .input('NombreEmpresa', companyName)
            .input('MembresiaID', membershipID)
            .input('Periodo', frecuency)
            .execute("Usp_API_UsuarioRegistroAgregar")
    }).then(result => {
        if (result.recordset[0].success == 'true') {
            stmp.sendEmailAccount(legalNamePerson, email, companyName, email)

            if (membershipID == 1)//membresia / plan gratuito
            {
                mssql.connect(sqlConnect.dbconnection()).then(() => {
                    
                    return new mssql.Request()
                        .input('EmpresaTransID', result.recordset[0].empresaTransID)
                        .input('MembresiaID', membershipID)
                        .input('Pago', 0.00)
                        .input('NoCuenta', "FREE")
                        .input('CorreoUsuario', email)
                        .execute("Usp_API_UsuarioMembresiaPagoAgregar")
                }).then(result1 => {
                    if(result1.recordset[0].success)
                        stmp.sendEmailMembership(result1.recordset[0].fechaVencimiento, result1.recordset[0].tipoPlan, result1.recordset[0].fechaActivacion, frecuency, "0.00", email, legalNamePerson)
                })
            }

            response.status(200).json({
                token: authToken.createToken(email, password, legalNamePerson),
                response: result.recordset
            })

        } else {
            response.status(200).json({
                token: '',
                response: result.recordset[0]
            })
        }

    }).catch(error => {
        response.status(500).send('Ocurrio un error al intentar conectarse con el servicio. Intente mas tarde.')
    })

})

module.exports = router


