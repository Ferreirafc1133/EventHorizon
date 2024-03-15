import express from 'express';
import { loginUser, registerUser, logoutUser } from '../controllers/authCont'; 

const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/logout', logoutUser);

export default router;
