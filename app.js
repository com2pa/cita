require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors')
const cookieParser = require('cookie-parser');


const usersRouter = require('./controllers/users');
const refresRouter = require('./controllers/refres')
const loginRouter = require('./controllers/login');
const logoutRouter = require('./controllers/logout');
const { usertExtractor } = require('./middleware/auth');

// const patientRouter = require('./controllers/patient');
// const nurseRouter = require('./controllers/nurse');
// const reportRouter = require('./controllers/report');
const { MONGO_URL } = require('./config');

// const morgan=require('morgan')

(async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log('Conectado a MongoDB :)');
  } catch (error) {
    console.log(error);
  }
})();
app.use(cors())
app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));
// app.use(morgan('tiny'))

// rutas backEnd
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use('/api/logout', logoutRouter);
app.use('/api/refres', usertExtractor, refresRouter)



// paciente
// app.use('/api/patient', patientRouter);
// cita

app.use(express.static(path.resolve(__dirname, 'dist')));

app.get('/*', function(request,response){
  response.sendFile(path.resolve(__dirname, 'dist', 'index.html' ));
});

module.exports = app;