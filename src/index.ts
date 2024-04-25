import express, { Application } from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import dotenv from 'dotenv';
import path from 'path';
import { engine } from 'express-handlebars';
import routes from './routes'; 
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import { registerHelpers } from './middlewares/handlebars.config';
import socketIo from 'socket.io';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

registerHelpers();
dotenv.config();

const swaggerConfig = require('./../swagger.config.json');
const swaggerDocs = swaggerJsDoc(swaggerConfig);

const app: Application = express();


app.use(
  session({
    secret: process.env.SECRET_KEY, 
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: process.env.NODE_ENV === 'production' 
    }, 
  })
);
app.use((req, res, next) => {
  next();
});



// Conexión a MongoDB
mongoose
  .connect(process.env.DB_URL!)
  .then(() => console.log('Conexión a MongoDB exitosa'))
  .catch((err) => console.error('Error conectando a MongoDB', err));

// Configuración de Handlebars
app.engine('handlebars', engine({
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials')
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Servir archivos estáticos
app.use('/public', express.static(path.join(__dirname, '../public')));

// Swagger UI
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

// Middlewares para parsear el cuerpo de las peticiones
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use(routes);

const PORT = process.env.PORT || 3000;

const httpServer = createServer(app);
const io = new SocketIOServer(httpServer);

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

io.on('connection', (socket) => {
  console.log('A new user connected');

  socket.on('newUser', (data) => {
    socket.data.username = data.user;  
    console.log(`${data.user} joined the chat`);
    socket.broadcast.emit('newUser', data);
  });

  socket.on('newMessage', (data) => {
    console.log(`Message from ${socket.data.username}: ${data.message}`);
    socket.broadcast.emit('newMessage', { user: socket.data.username, message: data.message });
  });

  socket.on('disconnect', () => {
    console.log(`${socket.data.username} disconnected`);
    socket.broadcast.emit('userLeft', { user: socket.data.username });
  });
});


