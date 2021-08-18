'use strict'

var express = require('express')
var router = express.Router()
var bodyParser = require('body-parser')

var conekta = require('conekta');

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
    let EmpresaTransID = request.params.EmpresaTransID
    let EsNueva = false

    conekta.api_key = 'key_THEXVyarQFRAkMmoLJbpGw';
    conekta.api_version = '2.0.0';

    if(!CostumerID)
    {
        EsNueva = true;
        //Creamos cliente en caso de ser un nuevo registro
        conekta.Customer.create({
            'name': Usuario,
            'email': Email,
            'metadata': { 'description': Usuario, 'reference': EmpresaTransID },
            'payment_sources': [{
                'type': 'card',
                'token_id': Token
            }]}, 
            function (err, res) {
                if(err)
                {
                    response.status(200).send({
                        success: false,
                        message: 'Existio un error al generar la solicitud de pago. Te hemos asignado 30 dias de una version gratuita para que puedas probar nuestro sistema.',
                        response: err
                    })

                //Aqui generamos la cuenta gratuita por error

                return;
            }
            CostumerID = res._json.id;
        });
    }

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
            "customer_id": CostumerID
        },
        "metadata": { "description": 'Pago de Membresia '+ Membresia +' Contadores Black: '+ Precio +'(MXN)', "reference": EmpresaTransID },
        "charges":[
        {
            "payment_method": {
                "type": "default"
            }
        }]
    }, 
    function(err, res) {
        if(err){
            if(EsNueva)
            {
                //Aqui generamos la cuenta gratuita por error

                response.status(200).send({
                    success: false,
                    message: 'Existio un error al generar la solicitud de pago. Te hemos asignado 30 dias de una version gratuita para que puedas probar nuestro sistema.',
                    response: err
                })
            }
            else
            {
                response.status(200).send({
                    success: false,
                    message: 'Existio un error al generar la solicitud de pago.',
                    response: err
                })
            }
            return;
        }
        response.status(200).send({
                    success: false,
                    message: 'Pago registrado de manera exitosa.',
                    response: CostumerID
                })
        return;
        // Si la orden fue exitosa aqui guardamos los datos del pago
        // res.toObject().id - ID de pago
        // res.toObject().charges.data[0].payment_method.auth_code - Codigo de autorización del pago
        // res.toObject().payment_status - Estatus del pago
    });

})

module.exports = router


