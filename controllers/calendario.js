const calendarioRouter =require('express').Router()
const Cita = require('../models/cita')

// obtener todas las citas

calendarioRouter.get('/', async (request, response) => {
    // busco todas las citas
    const citas = await Cita.find({}).populate('user','name');
    console.log('citas calendario', citas)
    // devuelvo las citas
    response.json(citas);
});

module.exports = calendarioRouter