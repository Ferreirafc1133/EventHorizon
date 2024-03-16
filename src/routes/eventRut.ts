import express from 'express';
import { crearEvento, listarEventos, inscribirEvento, editarEvento, eliminarEvento, asistirEvento, eliminarAsistente, manejarRegistrosEvento} from '../controllers/eventCont';
import { isAuthenticated } from '../middlewares/authMid'; 

const router = express.Router();


router.post('/eventos', isAuthenticated, crearEvento);

router.get('/eventos', isAuthenticated, listarEventos);

router.post('/eventos/:id/inscripcion', isAuthenticated, inscribirEvento);

router.put('/eventos/:id', isAuthenticated, editarEvento);

router.delete('/eventos/:id', isAuthenticated, eliminarEvento);

router.post('/eventos/:id/inscripciones', asistirEvento);

router.delete('/eventos/:id/inscripciones', eliminarAsistente);

router.get('/eventos/:id/inscripciones', manejarRegistrosEvento);


export default router;
