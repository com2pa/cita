const http = require('http');
const app = require('./app');


// Crear el servidor HTTP
const server = http.createServer(app);

// Iniciar el servidor HTTP
server.listen(3000, () => {
  console.log('El servidor está corriendo en el puerto 3000');
});
