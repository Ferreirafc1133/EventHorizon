import express, { Request, Response } from 'express';
import authRoutes from './authRut';
import adminRoutes from './adminRut';
import { verificarToken, establecerContextoAutenticacion } from '../middlewares/authMid';
import eventRoutes from './eventRut'; 
import cookieParser  from 'cookie-parser';

declare module 'express-session' {
  interface SessionData {
    userId?: string;
    username?: string;
  }
}

const router = express.Router();
router.use(cookieParser());
router.use(establecerContextoAutenticacion);
router.use(authRoutes);
router.use(eventRoutes);
router.use(adminRoutes);

/**
 * @swagger
 * /:
 *   get:
 *     summary: Muestra la página de inicio.
 *     description: Devuelve la página de inicio HTML con la lista de eventos en línea disponibles.
 *     tags: [HTML]
 *     responses:
 *       200:
 *         description: Página de inicio HTML.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 */
router.get('/', (req: Request, res: Response) => {
  res.render('home', {
      title: 'Eventos en línea',
      customCss: '/public/styles/home.css',
      showNavbar: true,
      userLoggedIn: res.locals.userLoggedIn,
      username: res.locals.username || 'Invitado'
  });
});

/**
 * @swagger
 * /register:
 *   get:
 *     summary: Muestra la página de registro.
 *     description: Devuelve la página de registro HTML, permitiendo a los nuevos usuarios crear una cuenta.
 *     tags: [HTML]
 *     responses:
 *       200:
 *         description: Página de registro HTML.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 */
router.get('/register', (req: Request, res: Response) => {
  res.render('register', {
      title: 'Página de Registro',
      showNavbar: false 
  });
});

/**
 * @swagger
 * /login:
 *   get:
 *     summary: Muestra la página de inicio de sesión.
 *     description: Devuelve la página de inicio de sesión HTML, permitiendo a los usuarios existentes acceder a su cuenta.
 *     tags: [HTML]
 *     responses:
 *       200:
 *         description: Página de inicio de sesión HTML.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 */
router.get('/login', (req: Request, res: Response) => {
  res.render('login', {
      title: 'Página de Inicio de Sesión',
      showNavbar: false 
  });
});

/**
 * @swagger
 * /eventos:
 *   get:
 *     summary: Muestra la página de eventos.
 *     description: Devuelve la página de eventos HTML, donde los usuarios pueden ver los eventos disponibles o próximos.
 *     tags: [HTML]
 *     responses:
 *       200:
 *         description: Página de eventos HTML.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 */
router.get('/eventos', (req: Request, res: Response) => {
  res.render('events', {
      title: 'Página de Eventos',
      showNavbar: true 
  });
});

router.get('/evento', (req: Request, res: Response) => {
  res.render('/editar-evento/', {
      title: 'Editar Evento',
      showNavbar: true 
  });
});

/**
 * @swagger
 * /perfil/editar:
 *   get:
 *     summary: Muestra la página para editar el perfil de usuario.
 *     description: Devuelve la página de edición del perfil HTML, accesible solo para usuarios autenticados.
 *     tags: [HTML]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Página de edición del perfil HTML.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       401:
 *         description: No autenticado. Usuario no ha proporcionado un token válido o no está logueado.
 */
router.get('/perfil', verificarToken, (req: Request, res: Response) => { //no sirve aun es un dummy
  res.render('profile', {
      title: 'Perfil',
      showNavbar: true,
      userLoggedIn: res.locals.userLoggedIn,
      username: res.locals.username
  });
});

router.get('/perfil/editar', verificarToken, (req: Request, res: Response) => { //no sirve aun es un dummy
  res.render('user_edit', {
      title: 'Editar Perfil',
      showNavbar: true,
      userLoggedIn: res.locals.userLoggedIn,
      username: res.locals.username 
  });
});

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Muestra la página de usuarios.
 *     description: Devuelve la página de usuarios HTML, donde se pueden ver los usuarios registrados. Este endpoint es un dummy y puede no estar funcional.
 *     tags: [HTML]
 *     responses:
 *       200:
 *         description: Página de usuarios HTML.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 */
router.get('/users', (req: Request, res: Response) => { //no sirve aun es un dummy
  res.render('users', {
      title: 'Página de usuarios',
      showNavbar: true 
  });
});



export default router;
