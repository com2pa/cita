const mongoose= require('mongoose')

const precioSchema =new mongoose.Schema({
    precio : Number,
    services: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
    },
    user:{
         type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }

})

precioSchema.set('toJSON',{
    transform: (document, returnedObject)=>{
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        
    }
})

const Precio = mongoose.model('Precio',precioSchema)

module.exports =Precio