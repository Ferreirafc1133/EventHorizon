import express from 'express';
import { loginUser, registerUser, logoutUser, editarPerfil, eliminarUsuario, verPerfil } from '../controllers/authCont'; 
import { verificarToken  } from '../middlewares/authMid'; 


const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/logout', verificarToken, logoutUser);

router.get('/me', verificarToken, verPerfil);

router.put('/edit', verificarToken, editarPerfil);

router.get('/delete', verificarToken, eliminarUsuario);



export default router;

