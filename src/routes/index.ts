import express, { Request, Response } from 'express';
import authRoutes from './authRut';
import { isAuthenticated } from '../middlewares/authMid';
import eventRoutes from './eventRut'; 

declare module 'express-session' {
  interface SessionData {
    userId?: string;
    username?: string;
  }
}

const router = express.Router();

router.use(authRoutes);
router.use(eventRoutes);


router.get('/', (req: Request, res: Response) => {
  res.render('home', {
      title: 'Eventos en línea',
      customCss: '/public/styles/home.css',
      showNavbar: true,
      userLoggedIn: req.session.userId !== undefined,
      username: req.session.username
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


export default router;
