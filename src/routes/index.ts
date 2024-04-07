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

router.get('/', (req: Request, res: Response) => {
  res.render('home', {
      title: 'Eventos en línea',
      customCss: '/public/styles/home.css',
      showNavbar: true,
      userLoggedIn: res.locals.userLoggedIn,
      username: res.locals.username || 'Invitado'
  });
});


router.get('/register', (req: Request, res: Response) => {
  res.render('register', {
      title: 'Página de Registro',
      showNavbar: false 
  });
});

router.get('/login', (req: Request, res: Response) => {
  res.render('login', {
      title: 'Página de Inicio de Sesión',
      showNavbar: false 
  });
});

router.get('/eventos', (req: Request, res: Response) => {
  res.render('events', {
      title: 'Página de Eventos',
      showNavbar: true 
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

router.get('/users', (req: Request, res: Response) => { //no sirve aun es un dummy
  res.render('users', {
      title: 'Página de usuarios',
      showNavbar: true 
  });
});



export default router;
