import express, { Request, Response } from 'express';
import authRoutes from './authRut';
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



export default router;
