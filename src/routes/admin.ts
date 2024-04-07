import express from "express";
import { editarPerfil, registerUser } from "../controllers/authCont";

const router = express.Router();

router.get('/users', isAdmin);
router.get('/users/:id', isAdmin);
router.put('/users/:id', isAdmin, editarPerfil);
router.put('/users/:id/roles', isAdmin, editarRol);
router.post('/users',isAdmin, registerUser);
router.delete('/users/:id', isAdmin)