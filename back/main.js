'use strict'

// express es un framework de node.js que nos permite crear un servidor web
const express = require('express');
const bodyParser = require('body-parser')
const dotenv = require('dotenv');
const socket_list = require('./sockets/socket_list')
const authenticate = require('./services/authenticate')
// Require the upload middleware
const upload = require('./services/upload');
// get config vars
dotenv.config();

//const pgp = require('pg-promise')(/* options */) //https://expressjs.com/en/guide/database-integration.html#postgresql
//const db = pgp('postgres://username:password@host:port/database')

// const app = module.exports = express()
const app = express();
var SocketSingleton = require('./sockets/socket'); // <--here
const http = require('http');
const server = http.createServer(app);
SocketSingleton.configure(server); // <--here
// const { Server } = require("socket.io");
// const io = new Server(server, {
//     cors: {
//       origin: '*' ,
//       methods: ["GET", "POST"],
//       transports: ['polling'],
//       credentials: true
//     }
//   });
const cors = require("cors"); //https://codedamn.com/news/backend/how-to-fix-cors-error
//const { common } = require('@material-ui/core/colors');
// swagger-jsdoc es un módulo de node.js que nos permite documentar nuestra API
const swaggerJsdoc = require('swagger-jsdoc');
// swagger-ui-express es un módulo de node.js que nos permite visualizar la documentación de nuestra API
const swaggerUi = require('swagger-ui-express');

// Opciones de configuración de Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API de MATCHA',
      version: '1.0.0',
      description: 'Esta es la documentación de la API de mi aplicación.',
      contact: {
        name: 'Soporte Técnico',
        url: 'http://www.miapp.com/soporte',
        email: 'soporte@miapp.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000'
      }
    ]
  },
  // Rutas a los archivos donde documentaste tus endpoints
  apis: ['./routes/*.js']
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));



const port = process.env.PORT || 3000

//const connections = [];
//app.locals.connections =["ll"]
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  transports: ['polling'],
  //"preflightContinue": false,
  //"optionsSuccessStatus": 204
}));



// io.on('connection', (socket) => {
//   console.log('a user connected',socket.id);
//   socket_list.STATIC_CONNECTIONS.push(socket.id);

//   console.log("jhjhjh", socket_list.STATIC_CONNECTIONS)
//   socket.on('disconnect', function() {
//     console.log('Got disconnect!', socket.id);
//     var i = socket_list.STATIC_CONNECTIONS.indexOf(socket.id);
//     socket_list.STATIC_CONNECTIONS.splice(i, 1);
//     console.log("jhjhjh", socket_list.STATIC_CONNECTIONS);
//   });
//   socket.on('chat', (msg) => {
//     console.log('message: ' + msg);
//     socket.emit('chat', msg);
//   });
// });
//app.use(express.static('public'))
/*
app.use('/uploads',(req,res,next) => {
  console.log(req.query.token)
  if (!!req.query.token) {
    // check validez token
    //!!!!!!!!!!!!!!!!!!!!!!!
    next();
  } else {
    // No user object found, terminate the pipeline with .end().
    next()
    res.status(501).end();
  }
});
*/
app.use('/uploads',[ express.static('uploads')]);
app.use('/images',[ express.static('public/images')]);
app.use('/api', require('./routes/api_v1'));
app.use('/users', require('./routes/users'));
app.use('/messages', require('./routes/messages'));
app.use('/notifications', require('./routes/notifications'));
app.use('/blocked', require('./routes/blocked'));
app.use('/matched', require('./routes/matched'));
app.use('/cards', require('./routes/cards'));
app.use('/uuid', require('./routes/uuid'));
app.use('/connected', require('./routes/connected'));
app.use('/verification', require('./routes/verification'));
app.use('/verifycode', require('./routes/verificationCode'));
app.use('/reset', require('./routes/reset'));
app.use('/resetpassword', require('./routes/resetpassword'));
app.use('/login', require('./routes/login'));
app.use('/verifyuser', require('./routes/verifyuser'));
app.use('/verifyemail', require('./routes/verifyemail'));
app.use('/verifylink', require('./routes/verifylink'));
app.use('/verifyclick', require('./routes/werifyclick'));
app.use('/upload-image', require('./routes/upload-image'));
app.use('/auth', require('./routes/auth'));
app.use('/google', require('./routes/login_google'));
app.use('/github', require('./routes/login_github'));
app.use('/42', require('./routes/login_42'));
app.use('/logs', require('./routes/logs'));
app.use('/tags', require('./routes/tags'));
app.use('/distinct', require('./routes/distinct'));

// Make io accessible to our router
app.use(function(req,res,next){
  req.io = io;
  next();
});



// // Add headers before the routes are defined
// app.use(function (req, res, next) {

//   // Website you wish to allow to connect
//   res.setHeader('Access-Control-Allow-Origin', '*');

//   // Request methods you wish to allow
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

//   // Request headers you wish to allow
//   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

//   // Set to true if you need the website to include cookies in the requests sent
//   // to the API (e.g. in case you use sessions)
//   res.setHeader('Access-Control-Allow-Credentials', true);

//   // Pass to next layer of middleware
//   next();
// });




// app.use((err, req, res, next) => {
//   const statusCode = err.statusCode || 500;
//   console.error(err.message, err.stack);
//   res.status(statusCode).json({ message: err.message });
//   return;
// });






app.get('/', (req, res) => {
  res.send('Hello World! ')
  //smtp.email()
})
// app.post('/', (req, res) => {
//   console.log(req.body)
//   res.send('Got a POST request')
// })

// app.post('/login', (req, res) => {
//     console.log(req)
//     res.send.json({
//       "id": 4,
//       "token": "QpwL5tke4Pnpja7X4"
//     })
//   })
// app.post('/email', (req, res) => {
//     console.log(req)
//     res.send.json({
//       "id": 4,
//       "token": "QpwL5tke4Pnpja7X4"
//     })
//   })
// app.put('/user', (req, res) => {
//     res.send('Got a PUT request at /user')
//   })

// app.delete('/user', (req, res) => {
//     res.send('Got a DELETE request at /user')
// })

server.listen(port, () => {
  console.log(`Servidor corriendo en puerto ${port} y Swagger en /api-docs`)
})