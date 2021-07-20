'use strict'

var express = require('express')
var bodyParser = require('body-parser')
var securityRoute = require('./securityRoutes')

var router = express.Router()

var mssql = require('mssql')
var sqlConnect = require('../dbase/dbConfig')

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

//recupera la información del perfil de usuario 
router.get('/api/profile/:EmpresaTransID', securityRoute, (request, response) => {
    let companyTransID = request.params.EmpresaTransID

    mssql.connect(sqlConnect.dbconnection()).then(() => {
        return new mssql.Request()
            .input('EmpresaTransID', companyTransID)
            .execute("Usp_API_PerfilUsuarioRecuperar")
    }).then(result => {
        console.log(result)
        if (result.recordsets[5][0].success) {
            response.status(200).json({
                response: result.recordsets[0]
            })
        }
    }).catch(error => {
        response.status(500).send('Ocurrio un error al intentar conectarse con el servicio. Intente mas tarde.')
    })
})

//actualizar información del perfil de usuario
router.put('/api/profile/:EmpresaTransID', securityRoute, (request, response) => {
    let companyTransID = request.params.EmpresaTransID

    let legalName = request.body.RepresentanteLegal
    let companyName = request.body.NombreEmpresa
    let password = request.body.Contrasena
    let giroID = request.body.GiroID
    let subgiroID = request.body.SubGiroID
    let activityID = request.body.ActividadID
    let otroGiro = 0//request.body.OtroGiroEmpresa
    let emailUser = request.body.CorreoUsuario

    mssql.connect(sqlConnect.dbconnection()).then(() => {
        return new mssql.Request()
            .input('EmpresaTransID', companyTransID)
            .input('RepresentanteLegal', legalName)
            .input('NombreEmpresa', companyName)
            .input('Contrasena', password)
            .input('GiroID', giroID)
            .input('SubGiroID', subgiroID)
            .input('ActividadID', activityID)
            .input('OtroGiroEmpresa', otroGiro)
            .input('CorreoUsuario', emailUser)
            .execute("Usp_API_PerfilUsuarioEditar")
    }).then(result => {
        console.log(result)
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