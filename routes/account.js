'use strict'

var express = require('express')
var router = express.Router()
var bodyParser = require('body-parser')
var authToken = require('../jwt/jwtoken')
var stmp = require("../util/smpt")
var bcrypt = require('bcrypt')

var mssql = require('mssql')

var sqlConnect = require('../dbase/dbConfig')
const securityRoute = require('./securityRoutes')

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

//crear cuenta de usuario
router.post('/api/user/createaccount', async (request, response) => {
    let legalNamePerson = request.body.legalNamePerson
    let companyName = request.body.companyName
    let email = request.body.email
    let membershipID = request.body.membershipID
    let frecuency = request.body.frecuency
    let empresaTransID = 0

    //Encriptacion de la contraseña
    const saltRounds = 10;
    var salt = bcrypt.genSaltSync(saltRounds);
    var hash = bcrypt.hashSync(request.body.password, salt);

    mssql.connect(sqlConnect.dbconnection()).then(() => {
        return new mssql.Request()
            .input('NombreUsuario', legalNamePerson)
            .input('CorreoUsuario', email)
            .input('Contrasena', hash)
            .input('NombreEmpresa', companyName)
            .input('MembresiaID', membershipID)
            .input('Periodo', frecuency)
            .execute("Usp_API_UsuarioRegistroAgregar")
    }).then(result => {
        if (result.recordset[0].success == 'true') {

            stmp.sendEmailAccount(legalNamePerson, email, companyName, email)

            if (membershipID == 1)//membresia / plan gratuito
            {
                new mssql.connect(sqlConnect.dbconnection()).then(() => {

                    return new mssql.Request()
                        .input('EmpresaTransID', result.recordset[0].empresaTransID)
                        .input('MembresiaID', membershipID)
                        .input('Pago', 0.00)
                        .input('NoCuenta', "FREE")
                        .input('CorreoUsuario', email)
                        .execute("Usp_API_UsuarioMembresiaPagoAgregar")
                }).then(result1 => {

                    if (result1.recordset[0].success)
                        stmp.sendEmailMembership(result1.recordset[0].fechaVencimiento, result1.recordset[0].tipoPlan, result1.recordset[0].fechaActivacion, frecuency, "0.00", email, legalNamePerson)
                })
            }

            response.status(200).json({
                token: authToken.createToken(email, hash),
                response: result.recordset
            })

        } else {
            response.status(200).json({
                token: '',
                response: result.recordset[0]
            })
            return mssql.close()
        }

    }).catch(error => {
        response.status(500).send('Ocurrio un error al intentar conectarse con el servicio. Intente mas tarde.')
        return mssql.close()
    })

})

//inicio de sesión de usuario
router.post('/api/user/login', async (request, response) => {
    let username = request.body.CorreoUsuario;

    //se valida el inicio de sesión  del usuario
    new mssql.connect(sqlConnect.dbconnection()).then(() => {
        return new mssql.Request()
            .input('CorreoUsuario', username)
            .execute("Usp_API_IniciarSesionRecuperar")
    }).then(async result => {

        if (result.recordsets[0][0].success == 'true') {
            if (bcrypt.compareSync(request.body.Contrasena, result.recordsets[0][0].Contrasena)) {
                let accessToken = authToken.createToken(username, result.recordsets[0][0].Contrasena)

                //se agrega el token del usuario a la base de datos
                new mssql.connect(sqlConnect.dbconnection()).then(() => {
                    return new mssql.Request()
                        .input('Token', accessToken)
                        .input('CorreoUsuario', username)
                        .execute("Usp_API_UsuarioTokenAgregar")
                }).then(resultToken => {

                    if (resultToken.recordsets[0][0].success) {

                        //se envia la respuesta al cliente
                        response.status(200).json({
                            token: accessToken,
                            response: result.recordsets[0]
                        })
                    }
                    return mssql.close()
                }).catch((err) => {
                    response.status(500).send('Ocurrio un error al intentar conectarse con el servicio. Intente mas tarde.' + err)
                    return mssql.close()
                })
            }
            else {

                response.status(200).json({
                    token: '',
                    response: {
                        response: {
                            success: "false",
                            message: "La credenciales ingresadas no coinciden, favor de revisar."
                        }
                    }
                })

                return mssql.close()
            }

        } else {

            response.status(200).json({
                response: {
                    token: '',
                    success: "false",
                    message: result.recordsets[0][0].message
                }
            })
        }


    }).catch((err) => {
        response.status(500).send('Ocurrio un error al intentar conectarse con el servicio. Intente mas tarde.' + err)
    })
})

//eliminar token de usuario pare cerrar sesión
router.delete('/api/user/logout/:Token', securityRoute, async (request, response) => {

    let token = request.params.Token;
    new mssql.connect(sqlConnect.dbconnection()).then(() => {
        return new mssql.Request()
            .input("Token", token)
            .execute("Usp_API_CerrarSesion")
    }).then(result => {

        if (result.recordsets[0][0].success) {
            response.status(200).json({
                success: result.recordsets[0][0].success,
                message: result.recordsets[0][0].message,
                response: []
            })
        }

        return mssql.close()

    }).catch(error => {
        response.status(500).send('Ocurrio un error al intentar conectarse con el servicio. Intente mas tarde.' + error)
        return mssql.close()
    })
})

//recuperar contraseña
router.post('/api/user/recoverypassword', async (request, response) => {
    let email = request.body.correousuario

    new mssql.connect(sqlConnect.dbconnection()).then(() => {
        return new mssql.Request()
            .input('CorreoUsuario', email)
            .execute("Usp_API_ContrasenaUsuarioRecuperar")
    }).then(result => {

        if (result.recordsets[0][0].success == 'true') {

            //Encriptacion de la contraseña
            const saltRounds = 10;
            var salt = bcrypt.genSaltSync(saltRounds);
            var hash = bcrypt.hashSync(String(result.recordsets[0][0].contrasenaTemporal), salt);
            console.log(hash)
            stmp.sendEmailRecoveryPassword(result.recordsets[0][0].legalNamePerson, email, result.recordsets[0][0].contrasenaTemporal)

            //mandar el hash a la base de datos
            new mssql.connect(sqlConnect.dbconnection()).then(() => {
                return new mssql.Request()
                    .input('Contrasena', hash)
                    .input('CorreoUsuario', email)
                    .execute("Usp_API_ContrasenaUsuarioActualizar")
            }).then(result1 => {

                response.status(200).json({
                    success: result1.recordsets[0][0].success,
                    message: 'Se ha enviado un correo electrónico con la información para la recuperación de la contraseña. Favor de ingresar y cambiar la contraseña temporal a una que sea fácil de recordar.',
                    response: result.recordsets[0]
                })

            }).catch(error => {
                response.status(500).send('Ocurrio un error al intentar conectarse con el servicio. Intente mas tarde.' + error)
            })
        }
        else {

            response.status(200).json({
                success: result.recordsets[0][0].success,
                message: result.recordsets[0][0].message,
                response: result.recordsets[0]
            })
        }

    }).catch(error => {
        response.status(500).send('Ocurrio un error al intentar conectarse con el servicio. Intente mas tarde.' + error)
        
    })
})

module.exports = router


