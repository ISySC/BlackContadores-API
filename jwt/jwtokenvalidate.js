'use strict'

const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('../configs/configs');

const app = express();
app.set('key', config.key);

let token = '';

const routesProtective = express.Router();

routesProtective.use((req, res, next) => {
    token = req.headers['access-token'];

    if (token) {
        jwt.verify(token, app.get('key'), (error, decoded) => {
            if (error) {
                return res.json({
                    status: false,
                    message: 'Token no válido',
                    response: null
                })
            }
            else {
                
                mssql.connect(sqlConnect.dbconnection()).then(() => {
                    return new mssql.Request()
                        .input('Token', token)
                        .execute("Usp_API_ValidarTokenUsuarioEmpresa")
                }).then(result => {
                    if (result.recordsets[1][0].success) {
                        response.status(200).json({
                            response: result.recordsets[0]
                        })
                    }
                }).catch(error => {
                    response.status(500).send('Ocurrio un error al intentar conectarse con el servicio. Intente mas tarde.')
                })



                let existToken = "select count(*) token, usuarioID from MtoTra_eTokenAccesoUsuario where Token = '" + token + "' group by UsuarioID"

                new mssql.Request().query(existToken, (error, result) => {
                    if (error) {
                        return res.json({
                            status: false,
                            message: 'Ocurrio un error al intentar validar el token del usuario. Detalles del error: ' + error,
                            response: null
                        })
                    } else {
                        if (result.recordset.length > 0) {
                            usuarioID = result.recordset[0].usuarioID
                            next()
                        } else {
                            return res.json({
                                status: false,
                                message: 'Acceso no válido',
                                response: null
                            })
                        }
                    }
                })
            }
        })
    } else { 
        res.status(200).send({
            status: false,
            message: 'Token no enviada',
            response: null
        })
    }
})