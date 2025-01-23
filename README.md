# Gestión de Citas para Servicios de Belleza  

Este proyecto tiene como objetivo principal administrar citas para servicios de belleza como cortes de cabello, manicure y pedicure.  

## Características principales  
- **Gestión de usuarios y roles**:  
  - **Administrador**: Puede gestionar usuarios (empleados), crear, editar y eliminar servicios, y supervisar las citas.  
  - **Empleado**: Puede gestionar las citas asignadas y definir los precios de los servicios ofrecidos.  
  - **Cliente**: Puede solicitar citas sin necesidad de registrarse en la plataforma.  

- **Notificaciones por correo electrónico**:  
  - Uso de **Nodemailer** para enviar verificaciones de correo, detalles de citas y actualizaciones de estado tanto al cliente como al administrador.  

- **Validaciones avanzadas**:  
  - Validación de formularios utilizando **Regex** para asegurar que los datos ingresados son correctos.  

## Tecnologías utilizadas  

### Frontend  
1. **React**: Para construir una interfaz de usuario interactiva y moderna.  
2. **Chakra UI**: Para facilitar el diseño y la personalización del frontend.  

### Backend  
1. **Node.js**: Para la lógica del servidor y la integración con la base de datos.  
2. **Express**: Framework de Node.js para crear una API RESTful eficiente.  
3. **Nodemailer**: Para manejar la verificación de correos electrónicos y notificaciones relacionadas con las citas.  

#### Middlewares  
Se implementaron los siguientes middlewares en el backend:  
- **Autenticación y autorización**:  
  - Middleware para validar el token de acceso JWT y restringir rutas según el rol del usuario (admin, empleado).  
- **Manejo de errores**:  
  - Middleware global para capturar errores y responder con mensajes claros al cliente.  
- **Validación de datos**:  
  - Middleware para validar el cuerpo de las solicitudes (e.g., datos de registro, citas) antes de procesarlas.  
- **CORS**:  
  - Middleware para permitir solicitudes desde el frontend en un entorno de desarrollo cruzado.  
  

### Base de datos  
- **MongoDB**: Base de datos NoSQL utilizada para almacenar usuarios, servicios, y detalles de citas.  

## Validación de formularios  
Se implementaron las siguientes expresiones regulares para validar la información del formulario:  

- **Correo electrónico**:  
  ```javascript
  const REGEX_EMAIL = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
  const REGEX_NAME = /^[A-Z][a-z]*[ ][A-Z][a-z]*$/;
  const REGEX_NUMBER = /^[0](212|412|414|424|416|426)[0-9]{7}$/;
  const REGEX_PASS = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z\d\s]).{8,15}$/;

  
