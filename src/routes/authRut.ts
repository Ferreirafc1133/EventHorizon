import express from 'express';
import { loginUser, registerUser, logoutUser, editarPerfil, eliminarUsuario, verPerfil } from '../controllers/authCont'; 
import { isAuthenticated } from '../middlewares/authMid'; 


const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/logout', isAuthenticated, logoutUser);

router.get('/me', isAuthenticated, verPerfil);

router.put('/edit', isAuthenticated, editarPerfil);

router.get('/delete', isAuthenticated, eliminarUsuario);



export default router;

