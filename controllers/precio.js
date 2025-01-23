const precioRouter=require('express').Router()
const Precio =require('../models/Precio')
const User =require('../models/user')
const Service=require('../models/service');
const { usertExtractor } = require('../middleware/auth');
const { default: mongoose } = require('mongoose');

// obteniendo todo los precio con respecto al usuario

precioRouter.get('/', async(request,response)=>{
    // // busco el usuario
    // const user = request.user;
    // // verifico
    // if(user.role!== "admin" && user.role!=='empleado'){
    //     return response.status(403).json('No estas autorizado para esta función');
    // }
    // user: user._id
        const precios = await Precio.find({}).populate('service','NameService').populate('user','name')
    // console.log(precios)
    return response.json(precios);
});



// creando el precio
precioRouter.post('/',usertExtractor, async(request,response)=>{
     // busco el usuario
    const user = request.user;
    // verifico
    if(user.role !== "admin" && user.role !== "empleado"){
        return response.status(403).json('No estas autorizado para esta función');
    }
    const {price, selectedService } = request.body;
    console.log(price,selectedService)
   

    // busco el servicio enviado
    const service = await Service.findById(selectedService);
    if (!service) {
        return response.status(404).json('El servicio no existe');
    }
    
    // verifico que el precio sea mayor que 0
    if (price <= 0) {
        return response.status(400).json('El precio debe ser mayor que 0');
    }
   

    // creo el precio
    const newPrecio = new Precio({
        precio:price,
        service:selectedService,
        user: user._id,
        
    });


    await newPrecio.save();

//     // // añadio el precio al usuario
//     // añadio el precio al usuario
// if (!user.precio.includes(newPrecio._id)) {
//     user.precio.push(newPrecio._id);
//     await user.save();
// } else {
//     return response.status(400).json('El precio ya está añadido');
// // }
    
    // lo devuelvo
    return response.status(201).json(newPrecio);
    
});

// editando el precio

precioRouter.put('/:id', usertExtractor, async (request, response) => {
    const user = request.user;

    // Verificar permisos
    if (user.role !== 'admin' && user.role !== 'empleado') {
        return response.status(403).json('No tienes permisos para editar este precio');
    }

    const { precio, selectedService } = request.body;
    console.log(precio,selectedService)

    // Validar datos
    // if (typeof precio !== 'number' || precio <= 0) {
    //     return response.status(400).json('El precio debe ser un número mayor que 0');
    // }

    if (!selectedService) {
        return response.status(400).json('El servicio asociado es requerido');
    }

    try {
        // Buscar el precio por ID
        const precioEditado = await Precio.findById(request.params.id);
        if (!precioEditado) {
            return response.status(404).json('El precio no existe');
        }

        // Actualizar precio y servicio
        precioEditado.precio = precio;
        precioEditado.service = selectedService;

        await precioEditado.save();

        // Devolver respuesta actualizada
        return response.status(200).json(precioEditado);
    } catch (error) {
        console.error(error);
        return response.status(500).json('Hubo un error al intentar editar el precio');
    }
});


// eliminar el precio
precioRouter.delete('/:id', usertExtractor, async (request, response) => {
    const user = request.user;

    // Verificar permisos
    if (user.role !== 'admin' && user.role !== 'empleado' ) {
        return response.status(403).json('No estás autorizado para esta función');
    }

    const { id } = request.params;
    console.log('eliminado',id)

    try {
        const precio = await Precio.findByIdAndDelete(id);

        if (!precio) {
            return response.status(404).json('El precio no existe');
        }
        
        return response.status(200).json({ message: 'Precio eliminado correctamente' });
    } catch (error) {
        return response.status(500).json('Hubo un error al intentar eliminar el precio');
    }
});


module.exports = precioRouter;

