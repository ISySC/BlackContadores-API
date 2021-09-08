'use strict'

const nodemailer = require('nodemailer');


function sendEmailAccount(nombre, correo, nombreEmpresa, usuarioAcceso){
    
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'administracion@contadoresblack.com',
          pass: 'blackadmon.1234'
        }});
        
        var mailoptions =  {
          from: 'Administración Black <administracion@contadoresblack.com>',
          to: correo,
          subject: 'Registro | Administración Black',
          html: '<span style="font-family: Helvetica;font-size: 14px">Buen día <b>' + nombre  + '</b></span>' + 
                '<br><br><span style="font-family: Helvetica;font-size: 14px"><b>Black Administrativo</b> agredece su preferencia; a continuación enviamos información de su cuenta recientemente creada </span>' + 
                '<br><br><span style="font-family: Helvetica;font-size: 14px">ESTA ES SU INFORMACIÓN:</span>' +
                '<br><span style="font-family: Helvetica;font-size: 14px">Nombre del representante legal: <b>' + nombre + '</b></span>' +
                '<br><span style="font-family: Helvetica;font-size: 14px">Nombre de la empresa / negocio: <b>' + nombreEmpresa + '</b></span>' +
                '<br><span style="font-family: Helvetica;font-size: 14px">Correo electrónico registrado: <b>' + usuarioAcceso + '</b></span>' +
                '<br><br><br><span style="font-family: Helvetica;font-size: 14px">Derechos reservados <span>&#169;</span> 2021. Black Administrativo, una solución de <a href="http://contadoresblack.com/" target="_blank">Black Contadores.</a></span>'
        };

      transporter.sendMail(mailoptions, (error) => {
        if(error) {
            let errorMail = {
                status: false,
                message: 'Ocurrio un error al intentar enviar el correo electrónico. Favor de intentar más tarde',
                response: error
            }

            console.log(errorMail)
        }
        else
          console.log("Envió satisfactorio")
    });

}

function sendEmailMembership(fechaVencimiento, tipoPlan, fechaActivacion, periocidad, costo, correo, nombre){
    
  var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'administracion@contadoresblack.com',
        pass: 'blackadmon.1234'
      }});
      
      var mailoptions =  {
        from: 'Administración Black <administracion@contadoresblack.com>',
        to: correo,
        subject: 'Administración Black | Plan ' + tipoPlan + ' ',
        html: '<span style="font-family: Helvetica;font-size: 14px">Buen día <b>' + nombre  + '</b></span>' + 
              '<br><br><span style="font-family: Helvetica;font-size: 14px"><b>Black Administrativo</b> agredece su preferencia; a continuación enviamos información referente a su plan seccionado </span>' + 
              '<br><br><span style="font-family: Helvetica;font-size: 14px">ESTA ES SU INFORMACIÓN:</span>' +
              '<br><span style="font-family: Helvetica;font-size: 14px">Plan: <b>' + tipoPlan + '</b></span>' +
              '<br><span style="font-family: Helvetica;font-size: 14px">Periocidad: <b>' + periocidad + '</b></span>' +
              '<br><span style="font-family: Helvetica;font-size: 14px">Costo: <b>' + costo + '</b></span>' +
              '<br><span style="font-family: Helvetica;font-size: 14px">Fecha de activación: <b>' + fechaActivacion + '</b></span>' +
              '<br><span style="font-family: Helvetica;font-size: 14px">Fecha de vencimiento: <b>' + fechaVencimiento + '</b></span>' +
              '<br><br><br><span style="font-family: Helvetica;font-size: 14px">Derechos reservados <span>&#169;</span> 2021. Black Administrativo, una solución de <a href="http://contadoresblack.com/" target="_blank">Black Contadores.</a></span>'
      };

    transporter.sendMail(mailoptions, (error) => {
      if(error) {
          let errorMail = {
              status: false,
              message: 'Ocurrio un error al intentar enviar el correo electrónico. Favor de intentar más tarde',
              response: error
          }
      }
      else
        console.log("Envió satisfactorio")
  });

}

function sendEmailRecoveryPassword(nombre, correo, contrasena){
    
  var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'administracion@contadoresblack.com',
        pass: 'blackadmon.1234'
      }});
      
      var mailoptions =  {
        from: 'Administración Black <administracion@contadoresblack.com>',
        to: correo,
        subject: 'Recuperación de contraseña | Administración Black',
        html: '<span style="font-family: Helvetica;font-size: 14px">Buen día <b>' + nombre  + '</b></span>' + 
              '<br><br><span style="font-family: Helvetica;font-size: 14px"><b>Black Administrativo</b> agredece su preferencia; a continuación, enviamos la contraseña temporal generada para el accesso a su cuenta </span>' + 
              '<br><br><span style="font-family: Helvetica;font-size: 14px">ESTA ES SU INFORMACIÓN:</span>' +
              '<br><span style="font-family: Helvetica;font-size: 14px">Contraseña temporal: <b>' + contrasena + '</b></span>' +
              '<br><span style="font-family: Helvetica;font-size: 14px">Correo electrónico registrado: <b>' + correo + '</b></span>' +
              '<br><br><span style="font-family: Helvetica;font-size: 14px"><b>Es IMPORTANTE una vez que acceda a su cuenta, cambiar la contraseña por una personal en la sección de Perfil </span>' + 
              '<br><br><br><span style="font-family: Helvetica;font-size: 14px">Derechos reservados <span>&#169;</span> 2021. Black Administrativo, una solución de <a href="http://contadoresblack.com/" target="_blank">Black Contadores.</a></span>'
      };

    transporter.sendMail(mailoptions, (error) => {
      if(error) {
          let errorMail = {
              status: false,
              message: 'Ocurrio un error al intentar enviar el correo electrónico. Favor de intentar más tarde',
              response: error
          }

          console.log(errorMail)
      }
      else
        console.log("Envió satisfactorio")
  });

}

function sendEmailPayment(fechaVencimiento, tipoPlan, fechaActivacion, periocidad, costo, correo, nombre){
    
  var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'administracion@contadoresblack.com',
        pass: 'blackadmon.1234'
      }});
      
      var mailoptions =  {
        from: 'Administración Black <administracion@contadoresblack.com>',
        to: correo,
        subject: 'Administración Black | Plan ' + tipoPlan + ' ',
        html: '<span style="font-family: Helvetica;font-size: 14px">Buen día <b>' + nombre  + '</b></span>' + 
              '<br><br><span style="font-family: Helvetica;font-size: 14px"><b>Black Administrativo</b> agredece su preferencia; a continuación enviamos información de su renovación de plan seccionado </span>' + 
              '<br><br><span style="font-family: Helvetica;font-size: 14px">ESTA ES SU INFORMACIÓN:</span>' +
              '<br><span style="font-family: Helvetica;font-size: 14px">Plan: <b>' + tipoPlan + '</b></span>' +
              '<br><span style="font-family: Helvetica;font-size: 14px">Periocidad: <b>' + periocidad + '</b></span>' +
              '<br><span style="font-family: Helvetica;font-size: 14px">Costo: <b>' + costo + '</b></span>' +
              '<br><span style="font-family: Helvetica;font-size: 14px">Fecha de activación: <b>' + fechaActivacion + '</b></span>' +
              '<br><span style="font-family: Helvetica;font-size: 14px">Fecha de vencimiento: <b>' + fechaVencimiento + '</b></span>' +
              '<br><br><br><span style="font-family: Helvetica;font-size: 14px">Derechos reservados <span>&#169;</span> 2021. Black Administrativo, una solución de <a href="http://contadoresblack.com/" target="_blank">Black Contadores.</a></span>'
      };

    transporter.sendMail(mailoptions, (error) => {
      if(error) {
          let errorMail = {
              status: false,
              message: 'Ocurrio un error al intentar enviar el correo electrónico. Favor de intentar más tarde',
              response: error
          }
      }
      else
        console.log("Envió satisfactorio")
  });

}

module.exports = {sendEmailAccount, sendEmailMembership, sendEmailRecoveryPassword, sendEmailPayment}