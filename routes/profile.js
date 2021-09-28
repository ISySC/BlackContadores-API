'use strict'

var express = require('express')
var bodyParser = require('body-parser')
var securityRoute = require('./securityRoutes')
var bcrypt = require('bcrypt')

var router = express.Router()

var mssql = require('mssql')
var sqlConnect = require('../dbase/dbConfig')

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

//recupera la información del perfil de usuario 
router.post('/api/profile/:EmpresaTransID', securityRoute, (request, response) => {
    let companyTransID = request.params.EmpresaTransID

    let usuarioID = request.body.UsuarioID

    return new Promise((resolve, reject) => {

        new mssql.ConnectionPool(sqlConnect.dbconnection()).connect().then(pool => {
            return pool.request()
                .input('EmpresaTransID', companyTransID)
                .input('UsuarioID', usuarioID)
                .execute("Usp_API_PerfilUsuarioRecuperar")
        }).then(result => {

            if (result.recordsets[5][0].success) {

                response.status(200).json({
                    message: result.recordsets[5][0].message,
                    success: result.recordsets[5][0].success,
                    response: {
                        'perfil': result.recordsets[0],
                        'membresias': result.recordsets[1],
                        'giros': result.recordsets[2],
                        'subgiros': result.recordsets[3],
                        'actividades': result.recordsets[4]
                    }
                })
            }

        }).catch(error => {
            response.status(500).send('Ocurrio un error al intentar conectarse con el servicio. Intente mas tarde.')

        })
    })
})

//actualizar información del perfil de usuario
router.put('/api/profile/:EmpresaTransID', securityRoute, (request, response) => {
    let companyTransID = request.params.EmpresaTransID

    let legalName = request.body.RepresentanteLegal
    let companyName = request.body.NombreEmpresa
    let phone = request.body.Telefono
    let giroID = request.body.GiroID
    let subgiroID = request.body.SubGiroID
    let activityID = request.body.ActividadID
    let otroGiro = 0//request.body.OtroGiroEmpresa
    let emailUser = request.body.CorreoUsuario
    let isChangedPassword = request.body.EsCambiarContrasena
    let otherActivity = request.body.OtraActividad
    let anioOperacion = request.body.AnioOperacion

    var password = ""

    if (isChangedPassword) {
        //Encriptacion de la contraseña
        const saltRounds = 10;
        var salt = bcrypt.genSaltSync(saltRounds);
        password = bcrypt.hashSync(request.body.Contrasena, salt);
    }
    else
        password = request.body.Contrasena

    new mssql.connect(sqlConnect.dbconnection()).then(() => {
        return new mssql.Request()
            .input('EmpresaTransID', companyTransID)
            .input('RepresentanteLegal', legalName)
            .input('NombreEmpresa', companyName)
            .input('Contrasena', password)
            .input('Telefono', phone)
            .input('GiroID', giroID)
            .input('SubGiroID', subgiroID)
            .input('ActividadID', activityID)
            .input('OtroGiroEmpresa', otroGiro)
            .input('CorreoUsuario', emailUser)
            .input('OtraActividad', otherActivity)
            .input('AnioOperacion', anioOperacion)
            .execute("Usp_API_PerfilUsuarioEditar")
    }).then(result => {

        if (result.recordsets[0][0].success) {
            response.status(200).json({
                response: result.recordsets[0]
            })
        }


    }).catch(error => {
        response.status(500).send('Ocurrio un error al intentar conectarse con el servicio. Intente mas tarde.')

    })
})

//actualizar información del pago de membresia del usuario
router.put('/api/profile/payment/:EmpresaTransID', securityRoute, (request, response) => {

    //Periodo = 'Me' (Mensual)

    let companyTransID = request.params.EmpresaTransID

    let membershipID = request.body.MembresiaID
    let frecuency = request.body.Periodo
    let payment = request.body.Pago
    let emailUser = request.body.CorreoUsuario

    new mssql.connect(sqlConnect.dbconnection()).then(() => {
        return new mssql.Request()
            .input('EmpresaTransID', companyTransID)
            .input('MembresiaID', membershipID)
            .input('Periodo', frecuency)
            .input('Pago', payment)
            .input('CorreoUsuario', emailUser)
            .execute("Usp_API_MembresiaEmpresaEditar")
    }).then(result => {

        if (result.recordsets[0][0].success) {
            response.status(200).json({
                response: result.recordsets[0]
            })
        }


    }).catch(error => {
        response.status(500).send('Ocurrio un error al intentar conectarse con el servicio. Intente mas tarde.')

    })
})



module.exports = router