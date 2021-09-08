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

//recupera la información de los usuarios (correos) de la empresa
router.get('/api/users/:EmpresaTransID', securityRoute, (request, response) => {
    let companyTransID = request.params.EmpresaTransID

    return new Promise((resolve, reject) => {

        new mssql.ConnectionPool(sqlConnect.dbconnection()).connect().then(pool => {
            return pool.request()
                .input('EmpresaTransID', companyTransID)
                .execute("Usp_API_UsuariosEmpresaRecuperar")
        }).then(result => {

            response.status(200).json({
                success: 'true',
                message: 'Usuarios de la empresa recuperados exitosamente',
                response: result.recordsets[0]
            })



        }).catch(error => {
            response.status(500).send('Ocurrio un error al intentar conectarse con el servicio. Intente mas tarde.')

        })
    })
})

//recupera la información de los usuarios (correos) de la empresa
router.get('/api/users/user/:UsuarioID', securityRoute, (request, response) => {
    let userID = request.params.UsuarioID

    return new Promise((resolve, reject) => {

        new mssql.ConnectionPool(sqlConnect.dbconnection()).connect().then(pool => {
            return pool.request()
                .input('UsuarioID', userID)
                .execute("Usp_API_UsuarioEmpresaRecuperar")
        }).then(result => {

            response.status(200).json({
                success: 'true',
                message: 'Información del usuario obtenida correctamente',
                response: result.recordsets[0]
            })



        }).catch(error => {
            response.status(500).send('Ocurrio un error al intentar conectarse con el servicio. Intente mas tarde.')

        })
    })
})

//agrega un usuario a la empresa desde el menu de usuarios
router.post('/api/users/user/add', securityRoute, (request, response) => {
    let companyTransID = request.body.EmpresaTransID
    let username = request.body.NombreUsuario
    let email = request.body.CorreoUsuario

    //Encriptacion de la contraseña
    const saltRounds = 10;
    var salt = bcrypt.genSaltSync(saltRounds);
    var password = bcrypt.hashSync(request.body.Contrasena, salt);

    return new Promise((resolve, reject) => {

        new mssql.ConnectionPool(sqlConnect.dbconnection()).connect().then(pool => {
            return pool.request()
                .input('EmpresaTransID', companyTransID)
                .input('NombreUsuario', username)
                .input('CorreoUsuario', email)
                .input('Contrasena', password)
                .execute("Usp_API_UsuarioEmpresaDisponibleAgregar")
        }).then(result => {

            response.status(200).json({
                success: result.recordsets[0][0].success,
                message: result.recordsets[0][0].message,
                response: []
            })

        }).catch(error => {
            response.status(500).send('Ocurrio un error al intentar conectarse con el servicio. Intente mas tarde.')

        })
    })
})

//modifica la información del usuario de correo
router.put('/api/users/user/:UsuarioID', securityRoute, (request, response) => {
    let userID = request.params.UsuarioID

    let username = request.body.NombreUsuario
    let isActived = request.body.EsActivo

    //Encriptacion de la contraseña
    const saltRounds = 10;
    var salt = bcrypt.genSaltSync(saltRounds);
    var password = bcrypt.hashSync(request.body.Contrasena, salt);

    return new Promise((resolve, reject) => {

        new mssql.ConnectionPool(sqlConnect.dbconnection()).connect().then(pool => {
            return pool.request()
                .input('UsuarioID', userID)
                .input('NombreUsuario', username)
                .input('Contrasena', password)
                .input('EsActivo', isActived)
                .execute("Usp_API_UsuarioEmpresaDisponibleEditar")
        }).then(result => {

            response.status(200).json({
                success: result.recordsets[0][0].success,
                message: result.recordsets[0][0].message,
                response: []
            })


        }).catch(error => {
            response.status(500).send('Ocurrio un error al intentar conectarse con el servicio. Intente mas tarde.')

        })
    })
})

module.exports = router