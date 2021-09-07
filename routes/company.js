'use strict'

var express = require('express')
var bodyParser = require('body-parser')

var router = express.Router()
var mssql = require('mssql')
var sqlConnect = require('../dbase/dbConfig')

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

var securityRoute = require('./securityRoutes')

//recuperar cuentas de la empresa
router.post('/api/company/bankaccounts', securityRoute, (request, response) => {
    let companyTransID = request.body.empresaTransID
    let showInactived = request.body.mostrarInactivos

    mssql.connect(sqlConnect.dbconnection()).then(() => {
        return new mssql.Request()
            .input('EmpresaTransID', companyTransID)
            .input('MostrarInactivos', showInactived)
            .execute("Usp_API_CuentasEmpresaRecuperar")
    }).then(result => {
        
        if (result.recordsets[1][0].success) {
            response.status(200).json({
                response: result.recordsets[0]
            })
        }
        mssql.close()
        
    }).catch(error => {
        response.status(500).send('Ocurrio un error al intentar conectarse con el servicio. Intente mas tarde.')
        mssql.close()
    })

})

//agrega una cuentas de la empresa
router.post('/api/company/bankaccounts/addbankaccount', securityRoute, (request, response) => {
    let companyTransID = request.body.empresaTransID
    let descriptionBankAccount = request.body.descripcionCuenta
    let username = request.body.correoUsuario
    let isActived = request.body.esActivo
    let typeofaccount = request.body.tipoCuentaID

    mssql.connect(sqlConnect.dbconnection()).then(() => {
        return new mssql.Request()
            .input('EmpresaTransID', companyTransID)
            .input('TipoCuentaID', typeofaccount)
            .input('DescripcionCuenta', descriptionBankAccount)
            .input('CorreoElectronico', username)
            .input('EsActivo', isActived)
            .execute("Usp_API_CuentaBancoEmpresaAgregar")
    }).then(result => {
        
        if (result.recordsets[0][0].success) {
           
            response.status(200).json({
                success: result.recordsets[0][0].success,
                message: result.recordsets[0][0].message,
                response: []
            })
        }

        mssql.close()

    }).catch(error => {
        response.status(500).send('Ocurrio un error al intentar conectarse con el servicio. Intente mas tarde.')
        mssql.close()
    })

})

//modificar una cuenta de la empresa
router.put('/api/company/bankaccounts/:CuentaID', securityRoute, (request, response) => {
    let accountID = request.params.CuentaID

    let descriptionBankAccount = request.body.descripcionCuenta
    let username = request.body.correoUsuario
    let isActived = request.body.esActivo
    let typeofaccount = request.body.tipoCuentaID
    
    mssql.connect(sqlConnect.dbconnection()).then(() => {
        return new mssql.Request()
            .input('CuentaID', accountID)
            .input('DescripcionCuenta', descriptionBankAccount)
            .input('CorreoElectronico', username)
            .input('TipoCuentaID', typeofaccount)
            .input('EsActivo', isActived)
            .execute("Usp_API_CuentaBancoEmpresaEditar")
    }).then(result => {
        
        if (result.recordsets[0][0].success) {
            response.status(200).json({
                success: result.recordsets[0][0].success,
                message: result.recordsets[0][0].message,
                response: []
            })
        }

        mssql.close()

    }).catch(error => {
        response.status(500).send('Ocurrio un error al intentar conectarse con el servicio. Intente mas tarde.' + error)
        mssql.close()
    })

})

//recuperar la información de una cuenta
router.get('/api/company/bankaccount/:CuentaID', securityRoute, (request, response) => {
    let bankaccount = request.params.CuentaID

    mssql.connect(sqlConnect.dbconnection()).then(() => {
        return new mssql.Request()
            .input('CuentaID', bankaccount)
            .execute("Usp_API_CuentaEmpresaRecuperar")
    }).then(result => {
        
        if (result.recordsets[0][0].success) {

            response.status(200).json({
                success: result.recordsets[0][0].success,
                message: result.recordsets[0][0].message,
                response: {
                    'Descripcion': result.recordsets[0][0].Descripcion,
                    'EsActivo': result.recordsets[0][0].EsActivo,
                    'TipoCuentaID': result.recordsets[0][0].TipoCuentaID
                }
            })
        }

        mssql.close()

    }).catch(error => {
        response.status(500).send('Ocurrio un error al intentar conectarse con el servicio. Intente mas tarde.')
        mssql.close()
    })
    
})

//agregar registro diario
router.post('/api/company/addregistry', securityRoute, (request, response) => {
    let empresaTransID = request.body.empresaTransID
    let descripcion = request.body.descripcion
    let fechaRegistro = request.body.fechaRegistro
    let referencia = request.body.referencia
    let clasificacionID = request.body.clasificacionID
    let subclasificacionID = request.body.subclasificacionID
    let cuentaID = request.body.cuentaID
    let typeofaccuntpay = request.body.tipoPagoCuenta
    let observaciones = request.body.observaciones
    let importe = request.body.importe
    let CreadoPor = request.body.CreadoPor
    let isCxC = request.body.EsCxC

    mssql.connect(sqlConnect.dbconnection()).then(() => {
        return new mssql.Request()
            .input('EmpresaTransID', empresaTransID)
            .input('Descripcion', descripcion)
            .input('FechaRegistro', fechaRegistro)
            .input('Referencia', referencia)
            .input('ClasificacionID', clasificacionID)
            .input('SubClasificacionID', subclasificacionID)
            .input('CuentaID', cuentaID)
            .input('TipoPagoCuenta', typeofaccuntpay)
            .input('EsCxC', isCxC)
            .input('Observaciones', observaciones)
            .input('Importe', importe)
            .input('CreadoPor', CreadoPor)
            .execute("Usp_API_RegistroDiarioAgregar")
    }).then(result => {
        
        if (result.recordset[0].success) {
            response.status(200).json({
                response: result.recordset
            })
        }

        mssql.close()
    }).catch(error => {
        response.status(500).send('Ocurrio un error al intentar conectarse con el servicio. Intente mas tarde.' + error)
        mssql.close()
    })

})

//actualiza registro diario
router.put('/api/company/updateregistry', securityRoute, (request, response) => {
    let folioID = request.body.folioID
    let descripcion = request.body.descripcion
    let fechaRegistro = request.body.fechaRegistro
    let referencia = request.body.referencia
    let clasificacionID = request.body.clasificacionID
    let subclasificacionID = request.body.subclasificacionID
    let cuentaID = request.body.cuentaID
    let observaciones = request.body.observaciones
    let importe = request.body.importe

    mssql.connect(sqlConnect.dbconnection()).then(() => {
        return new mssql.Request()
            .input('FolioID', folioID)
            .input('Descripcion', descripcion)
            .input('FechaRegistro', fechaRegistro)
            .input('Referencia', referencia)
            .input('ClasificacionID', clasificacionID)
            .input('SubClasificacionID', subclasificacionID)
            .input('CuentaID', cuentaID)
            .input('Observaciones', observaciones)
            .input('Importe', importe)
            .execute("Usp_API_RegistroDiarioEditar")
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

//actualiza registro diario
router.put('/api/company/deleteregistry', securityRoute, (request, response) => {
    let folioID = request.body.folioID

    mssql.connect(sqlConnect.dbconnection()).then(() => {
        return new mssql.Request()
            .input('FolioID', folioID)
            .execute("Usp_API_RegistroDiarioEliminar")
    }).then(result => {
        
        if (result.recordset[0].success) {
            response.status(200).json({
                response: result.recordset
            })
        }
        mssql.close()

    }).catch(error => {
        response.status(500).send('Ocurrio un error al intentar conectarse con el servicio. Intente mas tarde.')
        mssql.close()
    })

    
    
})

// recuperar los registros diarios de una empresa
router.post('/api/company/registries', securityRoute, (request, response) => {
    let empresaTransID = request.body.EmpresaTransID
    let fechaRegistro = request.body.FechaRegistro

    mssql.connect(sqlConnect.dbconnection()).then(() => {
        return new mssql.Request()
            .input('EmpresaTransID', empresaTransID)
            .input('FechaRegistro', fechaRegistro)
            .execute("Usp_API_RegistrosDiarioEmpresaRecuperar")
    }).then(result => {
        
        if (result.recordsets[1][0].success == 'true') {
            response.status(200).json({
                message: result.recordsets[1][0].message,
                success: result.recordsets[1][0].success,
                response: result.recordsets[0]
            })

        }

        mssql.close()

    }).catch(error => {
        response.status(500).send('Ocurrio un error al intentar conectarse con el servicio. Intente mas tarde.')
        mssql.close()
    })
})

//recuperar las clasificaciones
router.get('/api/company/clasifications', securityRoute, (request, response) => {
    
    mssql.connect(sqlConnect.dbconnection()).then(() => {
        return new mssql.Request()
            .execute("Usp_API_ClasificacionesRecuperar")
    }).then(result => {
        
        if (result.recordsets[1][0].success) {
            response.status(200).json({
                response: result.recordsets[0]
            })
        }
        mssql.close()
    }).catch(error => {
        response.status(500).send('Ocurrio un error al intentar conectarse con el servicio. Intente mas tarde. ' + error)
        mssql.close()
    })

})

//recuperar un registro diario por folio
router.get('/api/company/registry/:folioID', securityRoute, (request, response) => {
    let folioID = request.params.folioID

    new mssql.connect(sqlConnect.dbconnection()).then(() => {
        return new mssql.Request()
            .input("FolioID", folioID)
            .execute("Usp_API_RegistroDiarioEmpresaRecuperar")
    }).then(result => {
        
        if (result.recordsets[1][0].success) {
            response.status(200).json({
                response: result.recordsets[0]
            })
        }
        mssql.close()

    }).catch(error => {
        response.status(500).send('Ocurrio un error al intentar conectarse con el servicio. Intente mas tarde.')
        mssql.close()
    })
})

//recuperar un registro diario por folio
router.post('/api/company/registries/:EmpresaTransID', securityRoute, (request, response) => {
    let companyTransID = request.params.EmpresaTransID

    let initDay = request.body.FechaInicio
    let finalDay = request.body.FechaFin
    let clasificationID = request.body.ClasificacionID
    let subclasificacionID = request.body.SubClasificacionID 

    mssql.connect(sqlConnect.dbconnection()).then(() => {
        return new mssql.Request()
            .input("EmpresaTransID", companyTransID)
            .input("ClasificacionID", clasificationID)
            .input("SubClasificacionID", subclasificacionID)
            .input("FechaInicio", initDay)
            .input("FechaFin", finalDay)
            .execute("Usp_API_RegistrosDiarioPorParametrosEmpresaRecuperar")
    }).then(result => {
        
        if (result.recordsets[2][0].success) {

            response.status(200).json({
                success: result.recordsets[2][0].success,
                message: result.recordsets[2][0].message,
                totalAccount: result.recordsets[1][0],
                response: result.recordsets[0]
            })
        }
        mssql.close()
    }).catch(error => {
        response.status(500).send('Ocurrio un error al intentar conectarse con el servicio. Intente mas tarde.' + error)
        mssql.close()
    })

})

//agrega una subcategoria de la empresa
router.post('/api/company/subclasification', securityRoute, (request, response) => {
    let companyTransID = request.body.EmpresaTransID
    let clasificationID = request.body.ClasificacionID
    let isActived = request.body.EsActivo
    let concept = request.body.Concepto

    mssql.connect(sqlConnect.dbconnection()).then(() => {
        return new mssql.Request()
            .input("EmpresaTransID", companyTransID)
            .input("ClasificacionID", clasificationID)
            .input("Concepto", concept)
            .input("EsActivo", isActived)
            .execute("Usp_API_SubClasificacionAgregar")
    }).then(result => {
        
        if (result.recordsets[0][0].success) {

            response.status(200).json({
                success: result.recordsets[0][0].success,
                message: result.recordsets[0][0].message,
                response: null
            })
        }
        mssql.close()
    }).catch(error => {
        response.status(500).send('Ocurrio un error al intentar conectarse con el servicio. Intente mas tarde.' + error)
        mssql.close()
    })

})

//editar una subcategoria de la empresa
router.put('/api/company/subclasification', securityRoute, (request, response) => {
    let conceptID = request.body.ConceptoID
    let concept = request.body.Concepto
    let isActived = request.body.EsActivo
    let clasificationID = request.body.ClasificacionID

    mssql.connect(sqlConnect.dbconnection()).then(() => {
        return new mssql.Request()
            .input("ConceptoID", conceptID)
            .input("Concepto", concept)
            .input("EsActivo", isActived)
            .input("ClasificacionID", clasificationID)
            .execute("Usp_API_SubClasificacionEditar")
    }).then(result => {
        
        if (result.recordsets[0][0].success) {

            response.status(200).json({
                success: result.recordsets[0][0].success,
                message: result.recordsets[0][0].message,
                response: null
            })
        }
        mssql.close()
    }).catch(error => {
        response.status(500).send('Ocurrio un error al intentar conectarse con el servicio. Intente mas tarde.' + error)
        mssql.close()
    })
})

//recuperar las subclasificaciones
router.post('/api/company/subclasifications', securityRoute, (request, response) => {
    let companyTransID = request.body.EmpresaTransID
    let mostrarInactivos = request.body.mostrarInactivos

    mssql.connect(sqlConnect.dbconnection()).then(() => {
        return new mssql.Request()
            .input("EmpresaTransID", companyTransID)
            .input("MostrarInactivos", mostrarInactivos)
            .execute("Usp_API_SubClasificacionRecuperar")
    }).then(result => {
        
        if (result.recordsets[1][0].success) {
            response.status(200).json({
                success: result.recordsets[1][0].success,
                message: result.recordsets[1][0].message,
                response: result.recordsets[0]
            })
        }

        mssql.close()

    }).catch(error => {
        response.status(500).send('Ocurrio un error al intentar conectarse con el servicio. Intente mas tarde.')
        mssql.close()
    })

    
})

//Cobranza recuperar por empresa
router.post('/api/company/collections', securityRoute, (request, response) => {
    let companyTransID = request.body.EmpresaTransID
    let typeofaccount = request.body.TipoCuentaID
    

    mssql.connect(sqlConnect.dbconnection()).then(() => {
        return new mssql.Request()
            .input("EmpresaTransID", companyTransID)
            .input("TipoCuentaID", typeofaccount)
            .execute("Usp_API_CobranzaEmpresaRecuperar")
    }).then(result => {
        if (result.recordsets[1][0].success) {
            response.status(200).json({
                success: result.recordsets[1][0].success,
                message: result.recordsets[1][0].message,
                response: result.recordsets[0]
            })
        }
        mssql.close()
    }).catch(error => {
        response.status(500).send('Ocurrio un error al intentar conectarse con el servicio. Intente mas tarde.')
        mssql.close()
    })
    
})

//Cobranza recuperar por empresa
router.post('/api/company/collection/payment', securityRoute, (request, response) => {
    let isCxC = request.body.EsCxC
    let amount = request.body.Abono
    let createBy = request.body.CreadoPor
    let total = request.body.Total

    mssql.connect(sqlConnect.dbconnection()).then(() => {
        return new mssql.Request()
            .input("CxCID", isCxC)
            .input("Abono", amount)
            .input("CreadoPor", createBy)
            .input("Total", total)
            .execute("Usp_API_PagoCobranzaAgregar")
    }).then(result => {
        
        if (result.recordsets[0][0].success) {
            response.status(200).json({
                success: result.recordsets[0][0].success,
                message: result.recordsets[0][0].message,
                response: []
            })
        }
        mssql.close()
    }).catch(error => {
        response.status(500).send('Ocurrio un error al intentar conectarse con el servicio. Intente mas tarde.')
        mssql.close()
    })

    
})

//recupera los tipos de cuenta para ingresos (efectivo o banco)
router.get('/api/company/typeofaccount', (request, response) => {

    mssql.connect(sqlConnect.dbconnection()).then(() => {
        return new mssql.Request()
            .execute("Usp_API_TipoCuentaRecuperar")
    }).then(result => {
        
        if (result.recordsets[1][0].success) {
            response.status(200).json({
                success: result.recordsets[1][0].success,
                message: result.recordsets[1][0].message,
                response: result.recordsets[0]
            })
        }
        mssql.close()
    }).catch(error => {
        response.status(500).send('Ocurrio un error al intentar conectarse con el servicio. Intente mas tarde.')
        mssql.close()
    })

})

//editar saldos iniciales de la empresa
router.put('/api/company/openingbalances', securityRoute, (request, response) => {
    let companyTransID = request.body.EmpresaTransID
    let cash = request.body.Efectivo
    let banks = request.body.Bancos
    let debtsreceivable = request.body.DeudasCobrar
    let fixedasset = request.body.ActivoFijo
    let debtstopay = request.body.DeudasPagar
    let initialcapital = request.body.CapitalInicial
    let finalcapital = request.body.CapitalFinal
    let correoUsuario = request.body.CorreoUsuario

    mssql.connect(sqlConnect.dbconnection()).then(() => {
        return new mssql.Request()
            .input("EmpresaTransID", companyTransID)
            .input("Efectivo", cash)
            .input("Bancos", banks)
            .input("DeudasCobrar", debtsreceivable)
            .input("ActivoFijo", fixedasset)
            .input("DeudasPagar", debtstopay)
            .input("CapitalInicial", initialcapital)
            .input("CapitalFinal", finalcapital)
            .input("CorreoUsuario", correoUsuario)
            .execute("Usp_API_SaldoInicialEmpresaActualizar")
    }).then(result => {
        
        if (result.recordsets[0][0].success) {

            response.status(200).json({
                success: result.recordsets[0][0].success,
                message: result.recordsets[0][0].message,
                response: null
            })
        }
        mssql.close()
    }).catch(error => {
        response.status(500).send('Ocurrio un error al intentar conectarse con el servicio. Intente mas tarde.' + error)
        mssql.close()
    })
})

//recuperar saldos iniciales de la empresa
router.get('/api/company/openingbalances/:EmpresaTransID', securityRoute, (request, response) => {
    let companyTransID = request.params.EmpresaTransID

    mssql.connect(sqlConnect.dbconnection()).then(() => {
        return new mssql.Request()
            .input("EmpresaTransID", companyTransID)
            .execute("Usp_API_SaldoInicialEmpresaRecuperar")
    }).then(result => {
        
        if (result.recordsets[1][0].success) {

            response.status(200).json({
                success: result.recordsets[1][0].success,
                message: result.recordsets[1][0].message,
                response: result.recordsets[0]
            })
        }
        mssql.close()
    }).catch(error => {
        response.status(500).send('Ocurrio un error al intentar conectarse con el servicio. Intente mas tarde.' + error)
        mssql.close()
    })

})

//recuperar numero de reportes para la descarga
router.get('/api/company/reports/:EmpresaTransID', securityRoute, (request, response) => {
    let companyTransID = request.params.EmpresaTransID
    
    mssql.connect(sqlConnect.dbconnection()).then(() => {
        
        return new mssql.Request()
            .input("EmpresaTransID", companyTransID)
            .execute("Usp_API_ReportesMesEmpresaRecuperar")
    }).then(result => {
        
        if (result.recordsets[1][0].success) {

            response.status(200).json({
                success: result.recordsets[1][0].success,
                message: result.recordsets[1][0].message,
                response: result.recordsets[0]
            })
        }
        mssql.close()
    }).catch(error => {
        response.status(500).send('Ocurrio un error al intentar conectarse con el servicio. Intente mas tarde.' + error)
        mssql.close()
    })
})

//actualizar numero de reporte mensual de la empresa
router.put('/api/company/reports', securityRoute, (request, response) => {
    let companyTransID = request.body.EmpresaTransID

    new mssql.connect(sqlConnect.dbconnection()).then(() => {
        return new mssql.Request()
            .input("EmpresaTransID", companyTransID)
            .execute("Usp_API_ReportesMesEmpresaActualizar")
    }).then(result => {
        
        if (result.recordsets[0][0].success) {

            response.status(200).json({
                success: result.recordsets[0][0].success,
                message: result.recordsets[0][0].message,
                response: []
            })
        }
        mssql.close()
    }).catch(error => {
        response.status(500).send('Ocurrio un error al intentar conectarse con el servicio. Intente mas tarde.' + error)
        mssql.close()
    })

    

})

//obtener balance general de la empresa
router.get('/api/company/balancegeneral/:EmpresaTransID', securityRoute, (request, response) => {
    let companyTransID = request.params.EmpresaTransID
    

    mssql.connect(sqlConnect.dbconnection()).then(() => {
        return new mssql.Request()
            .input("EmpresaTransID", companyTransID)
            .execute("Usp_API_BalanceGeneralEmpresaRecuperar")
    }).then(result => {
        
        if (result.recordsets[1][0].success) {

            response.status(200).json({
                success: result.recordsets[1][0].success,
                message: result.recordsets[1][0].message,
                response: result.recordsets[0]
            })
        }
        mssql.close()
    }).catch(error => {
        response.status(500).send('Ocurrio un error al intentar conectarse con el servicio. Intente mas tarde.' + error)
        mssql.close()
    })

})

module.exports = router


