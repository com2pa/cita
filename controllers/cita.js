const citaRouter=require('express').Router()
const { usertExtractor } = require('../middleware/auth');
const Cita = require('../models/cita')
const Precio =require('../models/Precio')
const nodemailer =require('nodemailer')



// obtener todas las citas

citaRouter.get('/' ,usertExtractor,async(request,response)=>{  

  const  user  = request.user;

  if (user.role !== 'admin' && user.role !== 'empleado') {
    return response.status(403).json('No tienes permisos para ver todas las citas');
  }

    // busco todas las citas
    const citas = await Cita.find({ user:user._id }).populate('user','name').populate('Precio','precio')
    
    // devuelvo las citas
    response.json(citas);
});

// creando la cita
citaRouter.post('/', async(request,response)=>{
     const {
        name,
        email,
        phone,
        serviceSelected,
        time,
        date,
        
 
    } = request.body;
    console.log( 
        name,
        email,
        phone,        
        serviceSelected,
        time,
        date);
    // verificando que todos existen 
     if(!name || !email || !phone   || !date || !serviceSelected || !time){
         return response.status(400).json({error:'Todos los campon son requerido'})
     }
      //  verificar si el paciente ya esta registrado con el nombre y email
     const patientExist = await Cita.findOne({email,name})
     if(patientExist){
         return response.status(400).json(
            {
             error:'El email y nombre ya se encuentra en uso, espera nuestra respuesta !'
             }
        )
     }

      // Obtén el servicio seleccionado y su usuario asociado
    const serviceData = await Precio.findById(serviceSelected).populate('user').populate('precio','precio').populate('service','NameService')

    console.log(serviceData)
    if (!serviceData) {
      return response.status(404).json({ error: 'El servicio seleccionado no existe' });
    }
    // comparamos time si ya existe el mismo dia 

     const existeCita = await Cita.findOne({
        user: serviceData.user._id,
      service: serviceSelected.NameService,
      time,
      date,
     });
     if(existeCita){
         return response.status(400).json({error:'Ya hay una cita para este cliente en este horario, ingrese otra  para verificar si esta disponible , sino ingrese otro dia  '})
     }else{
          // creando nuevo usuario en la base de datos
        const newCliente = new Cita({
           name,
            email,
            phone,
            date,            
            time,
            precio: serviceData.precio,
            services: serviceData.NameService,
            user: serviceData.user._id,
            
        })
        
            const savedCita = await newCliente.save();

        // Poblar datos adicionales del cliente
        const populatedCliente = await Cita.findById(savedCita._id).populate('user', 'name phone email');

        // enviar correo para verificacion de usuaruio registrado
     const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // Use `true` for port 465, `false` for all other ports
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
    });
//     //  como enviar el correo
           await transporter.sendMail({
          from: process.env.EMAIL_USER, // sender address
          to: [email, process.env.EMAIL_USER],
          subject: "Solicitud de cita  ✔", // Subject line
          text: "Acontinuacion se presenta cita ", 
        //   html: `<p> cita: </p> <pre>${JSON.stringify(savedPatient, null, 2)}</pre> `, 
            html: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #007bff;">Detalles de la Cita</h2>
      <p>Gracias por reservar con nosotros. Aquí están los detalles de tu cita:</p>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <th style="text-align: left; padding: 8px; background-color: #f2f2f2;">Campo</th>
          <th style="text-align: left; padding: 8px; background-color: #f2f2f2;">Información</th>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">Nombre del Cliente</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${populatedCliente.name}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">Email del Cliente</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${populatedCliente.email}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">Teléfono del Cliente</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${populatedCliente.phone}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">Fecha</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${populatedCliente.date}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">Hora</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${savedCita.time}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">Precio</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${serviceData.precio}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">servicio</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${serviceData.service.NameService}</td>
        </tr>
      </table>
      <h3 style="color: #007bff; margin-top: 20px;">Detalles del Empleado</h3>
      <p>El empleado que te atenderá es:</p>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <th style="text-align: left; padding: 8px; background-color: #f2f2f2;">Campo</th>
          <th style="text-align: left; padding: 8px; background-color: #f2f2f2;">Información</th>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">Nombre</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${populatedCliente.user.name}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">Email</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${populatedCliente.user.email}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">Teléfono</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${populatedCliente.user.phone || 'No proporcionado'}</td>
        </tr>
      </table>
      <p style="margin-top: 20px;">Si tienes alguna pregunta, no dudes en contactarnos. ¡Gracias por confiar en nosotros!</p>
    </div>
                `, 
        });
          
    return response.status(201).json(' Mensaje Enviado ! se respondera a la brevedad !');
    }
       
})

// eliminar cita

citaRouter.delete('/:id', async(request,response)=>{
    const {id} = request.params;
    const citaDelete = await Cita.findByIdAndDelete(id)
    if(!citaDelete){
        return response.status(404).json({error:'La cita no existe'})
    }
    return response.json('Cita eliminada correctamente')
})

// actualizo el status de la cita

citaRouter.patch('/:id', async(request,response)=>{
    // busco al usuario de la cita
    const cita = await Cita.findByIdAndUpdate(request.params.id, {status: request.body.status}, {new: true})
    if(!cita){
       return response.status(404).json({error:'El paciente no existe'})
    }
    console.log('actualizado el status ', cita)
    // verifico si el paciente esta status espera
    if(cita.status == "espera"){
        // enviar correo para verificacion de usuaruio registrado
        const transporter = nodemailer.createTransport({
           host: 'smtp.gmail.com',
           port: 465,
           secure: true, // Use `true` for port 465, `false` for all other ports
           auth: {
             user: process.env.EMAIL_USER,
             pass: process.env.EMAIL_PASS,
           },
       });
          //  como enviar el correo
              await transporter.sendMail({
             from: process.env.EMAIL_USER, // sender address
             to: [cita.email, process.env.EMAIL_USER],
             subject: "Solicitud de cita  ✔", // Subject line
             text: "Acontinuacion se presenta cita ", 
             html: `<p> Su cita esta en al modalidad de espera</p>`, 
           }); 
    }else if(cita.status == 'finalizado'){
        // enviar correo para verificacion de usuaruio registrado
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // Use `true` for port 465, `false` for all other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

    //     //  como enviar el correo
      await transporter.sendMail({
        from: process.env.EMAIL_USER, // sender address
        to: [cita.email, process.env.EMAIL_USER],
        subject: "Solicitud de cita  ✔", // Subject line
        text: "Acontinuacion se presenta cita ",     
        html: ` <p> su cita a finalizado </p>`, 
    });
      }   
       return response.status(200).json('El status del cliente ha sido actualizado')
})
module.exports = citaRouter;

