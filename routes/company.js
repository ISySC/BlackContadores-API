'use strict'

var express = require('express')
var bodyParser = require('body-parser')

var router = express.Router()
var mssql = require('mssql')
var sqlConnect = require('../dbase/dbConfig')

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

//recuperar cuentas de la empresa
router.post('/api/company/bankaccounts', (request, response) => {
    let companyTransID = request.body.companyTransID

    mssql.connect(sqlConnect.dbconnection()).then(() => {
        return new mssql.Request()
            .input('EmpresaTransID', companyTransID)
            .execute("Usp_API_CuentasEmpresaRecuperar")
    }).then(result => {
        if (result.recordsets[1][0].success) {
            response.status(200).json({
                response: result.recordsets[0]
            })
        }
    }).catch(error => {
        response.status(500).send('Ocurrio un error al intentar conectarse con el servicio. Intente mas tarde.')
    })
})

//agregar registro diario
router.post('/api/company/addregistry', (request, response) => {
    let empresaTransID = request.body.empresaTransID
    let descripcion = request.body.descripcion
    let fechaRegistro = request.body.fechaRegistro
    let referencia = request.body.referencia
    let clasificacionID = request.body.clasificacionID
    let cuentaID = request.body.cuentaID
    let observaciones = request.body.observaciones
    let importe = request.body.importe

    mssql.connect(sqlConnect.dbconnection()).then(() => {
        return new mssql.Request()
            .input('EmpresaTransID', empresaTransID)
            .input('Descripcion', descripcion)
            .input('FechaRegistro', fechaRegistro)
            .input('Referencia', referencia)
            .input('ClasificacionID', clasificacionID)
            .input('CuentaID', cuentaID)
            .input('Observaciones', observaciones)
            .input('Importe', importe)
            .execute("Usp_API_RegistroDiarioAgregar")
    }).then(result => {
        if (result.recordset[0].success) {
            response.status(200).json({
                response: result.recordset
            })
        }

    }).catch(error => {
        response.status(500).send('Ocurrio un error al intentar conectarse con el servicio. Intente mas tarde.')
    })
})

// recuperar los registros diarios de una empresa
router.post('/api/company/registries', (request, response) => {
    let empresaTransID = request.body.empresaTransID
    let fechaRegistro = request.body.fechaRegistro

    mssql.connect(sqlConnect.dbconnection()).then(() => {
        return new mssql.Request()
            .input('EmpresaTransID', empresaTransID)
            .input('FechaRegistro', fechaRegistro)
            .execute("Usp_API_RegistrosDiarioEmpresaRecuperar")
    }).then(result => {
        if (result.recordsets[1][0].success) {
            response.status(200).json({
                message: result.recordsets[1][0].message,
                success: result.recordsets[1][0].success,
                response: result.recordsets[0]
            })
        }

    }).catch(error => {
        response.status(500).send('Ocurrio un error al intentar conectarse con el servicio. Intente mas tarde.')
    })
})

//recuperar las clasificaciones
router.get('/api/company/clasifications', (request, response) => {
    mssql.connect(sqlConnect.dbconnection()).then(() => {
        return new mssql.Request()
            .execute("Usp_API_ClasificacionesRecuperar")
    }).then(result => {
        if (result.recordsets[1][0].success) {
            response.status(200).json({
                response: result.recordsets[0]
            })
        }
    }).catch(error => {
        response.status(500).send('Ocurrio un error al intentar conectarse con el servicio. Intente mas tarde.')
    })
})

//recuperar un registro diario por folio
router.get('/api/company/registry/:folioID', (request, response) => {
    let folioID = request.params.folioID

    mssql.connect(sqlConnect.dbconnection()).then(() => {
        return new mssql.Request()
            .input("FolioID", folioID)
            .execute("Usp_API_RegistroDiarioEmpresaRecuperar")
    }).then(result => {
        if (result.recordsets[1][0].success) {
            response.status(200).json({
                response: result.recordsets[0]
            })
        }
    }).catch(error => {
        response.status(500).send('Ocurrio un error al intentar conectarse con el servicio. Intente mas tarde.')
    })
})


module.exports = router


