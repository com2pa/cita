const mongoose =require('mongoose')


const citaSchema = new mongoose.Schema({
    name :String,
    email : String,
    phone: Number,
    time:String,
    date: {
        type: Date,
        default: () => new Date().setHours(0, 0, 0, 0),
    },    
    status:[{
        type:String,
        enu:['espera', 'finalizado'],
    }],
    Precio: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'precio',
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
    

})

citaSchema.set('toJSON',{
    transform: (document, returnedObject)=>{
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        
    }
})

const Cita =mongoose.model('Cita',citaSchema)

module.exports = Cita