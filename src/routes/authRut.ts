import express from 'express';
import { loginUser, registerUser, logoutUser, editarPerfil, eliminarUsuario, verPerfil, updateProfilePicture  } from '../controllers/authCont'; 
import { verificarToken, esAdmin } from '../middlewares/authMid'; 
import { uploadS3Middleware } from '../middlewares/userMid';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import swaggerConfig from './../../swagger.config.json';

const router = express.Router();
const swaggerDocs = swaggerJsDoc(swaggerConfig);



router.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));
/**
 * @swagger
 * /register:
 *  post:
 *   summary: Registra un nuevo usuario
 *   tags: [Autenticacion]
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           required:
 *             - nombre
 *             - email
 *             - password
 *           properties:
 *             nombre:
 *               type: string
 *               description: Nombre completo del usuario
 *             email:
 *               type: string
 *               format: email
 *               description: Correo electrónico del usuario
 *             password:
 *               type: string
 *               format: password
 *               description: Contraseña del usuario
 *   responses:
 *     201:
 *       description: Usuario registrado exitosamente.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: El ID único del usuario registrado
 *               email:
 *                 type: string
 *                 description: El correo electrónico del usuario registrado
 *     400:
 *       description: Datos inválidos suministrados en la solicitud.
 *     409:
 *       description: El usuario ya existe.
 *   description: Permite registrar un nuevo usuario en el sistema.
 */
router.post('/register', registerUser);

/**
 * @swagger
 * /login:
 *  post:
 *   summary: Inicia sesión de usuario
 *   tags: [Autenticacion]
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *               format: email
 *               description: Correo electrónico del usuario
 *             password:
 *               type: string
 *               format: password
 *               description: Contraseña del usuario
 *   responses:
 *     200:
 *       description: Inicio de sesión exitoso, devuelve el token de acceso.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: Token de acceso JWT
 *     400:
 *       description: Petición inválida, falta correo electrónico o contraseña.
 *     401:
 *       description: Credenciales no válidas.
 *   description: Permite a los usuarios iniciar sesión y obtener un token de acceso.
 */
router.post('/login', loginUser);

/**
 * @swagger
 * /logout:
 *  get:
 *   summary: Cierra la sesión del usuario
 *   tags: [Autenticacion]
 *   security:
 *     - bearerAuth: []
 *   responses:
 *     200:
 *       description: Sesión cerrada exitosamente.
 *     401:
 *       description: No autorizado, token inválido o no proporcionado.
 *   description: Cierra la sesión del usuario y revoca el token de acceso.
 */
router.get('/logout', verificarToken, logoutUser);

/**
 * @swagger
 * /me:
 *  get:
 *   summary: Obtiene los datos del perfil del usuario
 *   tags: [Usuarios]
 *   security:
 *     - bearerAuth: []
 *   responses:
 *     200:
 *       description: Datos del perfil del usuario, excluyendo la contraseña.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *                 description: ID único del usuario
 *               fullname:
 *                 type: string
 *                 description: Nombre completo del usuario
 *               username:
 *                 type: string
 *                 description: Nombre de usuario
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email del usuario
 *               description:
 *                 type: string
 *                 description: Descripción del perfil del usuario
 *               profilePicture:
 *                 type: string
 *                 description: URL de la imagen de perfil del usuario
 *               cvLink:
 *                 type: string
 *                 description: Enlace al CV del usuario
 *               interests:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Lista de intereses del usuario
 *               role:
 *                 type: string
 *                 description: Rol del usuario en la plataforma
 *     404:
 *       description: Usuario no encontrado.
 *     500:
 *       description: Error al obtener el perfil del usuario.
 *   description: Devuelve la información del perfil del usuario basado en el token de autenticación proporcionado, excluyendo la contraseña.
 */
router.get('/me', verificarToken, verPerfil);

/**
 * @swagger
 * /edit:
 *  put:
 *   summary: Edita el perfil del usuario
 *   tags: [Usuarios]
 *   security:
 *     - bearerAuth: []
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             nombre:
 *               type: string
 *               description: El nuevo nombre del usuario.
 *             email:
 *               type: string
 *               format: email
 *               description: El nuevo correo electrónico del usuario.
 *             password:
 *               type: string
 *               format: password
 *               description: La nueva contraseña del usuario (opcional).
 *   responses:
 *     200:
 *       description: Perfil actualizado exitosamente.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mensaje:
 *                 type: string
 *                 example: Perfil actualizado exitosamente.
 *     400:
 *       description: Información proporcionada inválida o incompleta.
 *     401:
 *       description: No autorizado, token inválido o no proporcionado.
 *   description: Permite a los usuarios autenticados editar su perfil, incluyendo nombre, correo electrónico y contraseña.
 */
router.put('/edit', verificarToken, editarPerfil);

/**
 * @swagger
 * /delete:
 *  delete:
 *   summary: Elimina el usuario autenticado
 *   tags: [Usuarios]
 *   security:
 *     - bearerAuth: []
 *   responses:
 *     200:
 *       description: Usuario eliminado exitosamente.
 *     401:
 *       description: No autorizado, token inválido o no proporcionado.
 *     404:
 *       description: Usuario no encontrado.
 *     500:
 *       description: Error al eliminar el usuario.
 *   description: Elimina el perfil del usuario basado en el token de autenticación proporcionado. Esta acción es irreversible.
 */
router.delete('/delete', verificarToken, eliminarUsuario);

router.post('/perfil/foto', verificarToken, uploadS3Middleware, updateProfilePicture);


export default router;

