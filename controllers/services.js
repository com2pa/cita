const serviceRouter =require('express').Router()
const Service = require('../models/service')
const Precio =require('../models/Precio');
const { usertExtractor } = require('../middleware/auth');

// obteniendo todos los servicios

serviceRouter.get('/', async (request, response) => {
    // busco todos los servicios
    const services = await Service.find({});
    // devuelvo los servicios
    response.json(services);
});


// creacion del servicio
serviceRouter.post('/',usertExtractor, async (request, response) => {
    // busco al usuario
    const user = request.user;
    // verifico
    if(!user.role == "admin"){
        return response.status(403).json('No estas autorizado para esta función');
    }
    // lo que me envia
    const { NameService } = request.body;
    // creo un nuevo servicio
    const service = new Service({ 
        NameService,
        user:user.id

    });

    
    const savedService = await service.save();
    // agrego el servicio al usuario
  
    // devuelvo el servicio guardado
    response.status(201).json(savedService);
});

// editando el servicio

serviceRouter.put('/:id', usertExtractor, async (request, response) => {
    // busco el usuario
    const user = request.user;
    // verifico
    if(!user.role == "admin"){
        return response.status(403).json('No estas autorizado para esta función');
    }
    // busco el servicio
    const service = await Service.findByIdAndUpdate(request.params.id, request.body, {new: true});
    if(!service){
        return response.status(404).json({error:'servicio no encontrado'});
    }
    console.log('antes',service)

    // lo que envio el usuario en front
    const {NameService} = request.body
    service.NameService= NameService

    // si el nombre del serivicio es diferente
    if(service.NameService!== NameService){
        // verifico si el nombre ya existe para este usuario
        const sameNameServices = await Service.find({NameService, user: user._id})
        console.log(sameNameServices) ;
        // busco si el nombre ya existe
        if(sameNameServices.length > 0){
            
            return response.status(400).json('El nombre del servicio ya existe para este usuario');  
        }
    }else{
        // si el nombre es diferente y no existe, guardo el nuevo nombre
        const updatedService = await service.save();
        console.log('despues ',updatedService.NameService) ;
        
        // luego lo devuelvo
        return response.status(200).json('modificado');
    }
   
});

// eliminando el servicio

serviceRouter.delete('/:id', usertExtractor, async (request, response) => {
    // busco el usuario
    const user = request.user;
    // verifico
    if(!user.role == "admin"){
        return response.status(403).json('No estas autorizado para esta función');
    }
    // busco el servicio
    const service = await Service.findByIdAndDelete(request.params.id);
    if(!service){
        return response.status(404).json({error:'servicio no encontrado'});
    }
   

    // elimino los precios asociados al servicio
    // await Precio.deleteMany({service: service._id});
    
    // luego lo devuelvo
    return response.status(200).json('servicio eliminado');

});

 
module.exports = serviceRouter;