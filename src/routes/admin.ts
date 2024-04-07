import express from 'express';
import { registerUser, editarPerfil, cambiarRolUsuario } from '../controllers/authCont'; 
import { verificarToken, esAdmin } from '../middlewares/authMid'; 
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import swaggerConfig from './../../swagger.config.json';

const router = express.Router();
const swaggerDocs = swaggerJsDoc(swaggerConfig);


router.get('/users', esAdmin);
router.get('/users/:id', esAdmin);
router.put('/users/:id', esAdmin, editarPerfil);
router.put('/users/:id/roles', esAdmin, cambiarRolUsuario);
router.post('/users',esAdmin, registerUser);
router.delete('/users/:id', esAdmin)