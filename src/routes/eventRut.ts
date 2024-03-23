import express from 'express';
import { crearEvento, listarEventos, inscribirEvento, editarEvento, eliminarEvento, asistirEvento, eliminarAsistente, manejarRegistrosEvento} from '../controllers/eventCont';
import { verificarToken } from '../middlewares/authMid';


const router = express.Router();


router.post('/eventos', verificarToken, crearEvento);

router.get('/eventos', verificarToken, listarEventos);

router.post('/eventos/:id/inscripcion', verificarToken, inscribirEvento);

router.put('/eventos/:id', verificarToken, editarEvento);

router.delete('/eventos/:id', verificarToken, eliminarEvento);

router.post('/eventos/:id/inscripciones', asistirEvento);

router.delete('/eventos/:id/inscripciones', eliminarAsistente);

router.get('/eventos/:id/inscripciones', manejarRegistrosEvento);


export default router;
