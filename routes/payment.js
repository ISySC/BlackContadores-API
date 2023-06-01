'use strict'

var express = require('express')
var router = express.Router()
var bodyParser = require('body-parser')

var mssql = require('mssql')
var sqlConnect = require('../dbase/dbConfig')

var conekta = require('conekta');
var stmp = require("../util/smpt")

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

//Realizar Pagos de Membresias Nuevas o Existentes
router.post('/api/payment/', async (request, response) => {

    let MembresiaID = request.body.MembresiaID
    let Membresia = request.body.Membresia
    let Precio = request.body.Precio
    let Email = request.body.Email
    let Usuario = request.body.Usuario
    let Token = request.body.Token
    let CostumerID = request.body.CostumerID
    let EmpresaTransID = request.body.EmpresaTransID
    let EsNueva = false
    let frecuency = request.body.Frecuencia

    conekta.api_key = 'key_k3BUXdVMJjR2QbiPZux9ow';
    conekta.api_version = '2.0.0';

    //Generamos la orden de pago
    conekta.Order.create({
        "line_items": [
            {
                "name": "Pago de Membresia " + Membresia,
                "unit_price": Precio * 100,
                "quantity": 1
            }],
        "currency": "MXN",
        "customer_info": {
            'name': Usuario,
            'email': Email,
            'phone': '+52181818181'
        },
        "metadata": { "description": 'Pago de Membresia ' + Membresia + ' Contadores Black: ' + Precio + '(MXN)', "reference": EmpresaTransID },
        "charges": [
            {
                "payment_method": {
                    "type": "card",
                    'token_id': Token
                }
            }]
    },
        function (err, res) {
            if (err) {

                response.status(200).send({
                    success: false,
                    message: 'Existio un error al generar la solicitud de pago. Favor de revisar sus datos e intentar de nuevo',
                    response: err
                })
                return;
            }

            new mssql.connect(sqlConnect.dbconnection()).then(() => {
                return new mssql.Request()
                    .input('EmpresaTransID', EmpresaTransID)
                    .input('MembresiaID', MembresiaID)
                    .input('Periodo', frecuency)
                    .input('Pago', Precio)
                    .input('CorreoUsuario', Email)
                    .execute("Usp_API_MembresiaEmpresaEditar")
            }).then(result => {
                if (result.recordsets[1][0].success) {

                    response.status(200).json({
                        success: result.recordsets[1][0].success,
                        message: result.recordsets[1][0].message,
                        response: []
                    })

                    console.log(result.recordsets[0][0])

                    stmp.sendEmailPayment(result.recordsets[0][0].fechaVencimiento, result.recordsets[0][0].tipoPlan, result.recordsets[0][0].fechaActivacion, frecuency, Precio, Email, result.recordsets[0][0].NombreUsuario)
                }

            }).catch(error => {
                response.status(500).send('Ocurrio un error al intentar conectarse con el servicio. Intente mas tarde.' + error)

            })

            /*response.status(200).send({
                success: true,
                message: 'Pago registrado de manera exitosa.',
                response: CostumerID
            })
            return;*/
            // Si la orden fue exitosa aqui guardamos los datos del pago
            // res.toObject().id - ID de pago
            // res.toObject().charges.data[0].payment_method.auth_code - Codigo de autorización del pago
            // res.toObject().payment_status - Estatus del pago
        });
})

module.exports = router


