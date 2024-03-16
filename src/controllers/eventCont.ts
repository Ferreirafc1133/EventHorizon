import { Request, Response } from 'express';
import Evento from '../models/eventMod'; 
import { ResponseStatus } from '../utils/response-status';

const crearEvento = async (req: Request, res: Response) => {
    try {
        const { titulo, descripcion, fechaInicio, fechaFin, activo, organizador, colaboradores } = req.body;

        const nuevoEvento = new Evento({
            titulo,
            descripcion,
            fechaInicio,
            fechaFin,
            activo,
            organizador,
            colaboradores
        });

        await nuevoEvento.save();
        res.status(ResponseStatus.CREATED).json(nuevoEvento);
    } catch (err) {
        console.error('Error al crear el evento:', err);
        res.status(ResponseStatus.INTERNAL_SERVER_ERROR).send('Error al crear el evento');
    }
}; //nice

const listarEventos = async (req: Request, res: Response) => {
    try {
        const eventos = await Evento.find({});
        res.json(eventos);
    } catch (err) {
        console.error('Error al listar los eventos:', err);
        res.status(ResponseStatus.INTERNAL_SERVER_ERROR).send('Error al listar los eventos');
    }
}; //nice

const inscribirEvento = async (req: Request, res: Response) => {
    const { id } = req.params;
    res.send({ mensaje: `Inscrito en el evento con id ${id}. Implementar lógica despues.` });
};

const editarEvento = async (req: Request, res: Response) => {
    const { id } = req.params;
    res.send({ mensaje: `Evento con id ${id} editado. Implementar lógica de despues.` });
};

const eliminarEvento = async (req: Request, res: Response) => {
    const { id } = req.params;
    res.send({ mensaje: `Evento con id ${id} eliminado. Implementar lógica despues.` });
};

const asistirEvento = async (req: Request, res: Response) => {
    const { id } = req.params; 
    const { attendeeId } = req.body; 
    res.send({ mensaje: `Asistente con id ${attendeeId} añadido al evento con id ${id}. Implementar lógica.` });
};

const eliminarAsistente = async (req: Request, res: Response) => {
    const { id } = req.params; 
    const { attendeeId } = req.body; 
    res.send({ mensaje: `Asistente con id ${attendeeId} eliminado del evento con id ${id}. Implementar lógica.` });
};

const manejarRegistrosEvento = async (req: Request, res: Response) => {
    const { id } = req.params; 
    res.send({ mensaje: `Inscripciones para el evento con id ${id} recuperadas. Implementar lógica despues.` });
};



export {
    crearEvento,
    listarEventos,
    inscribirEvento,
    editarEvento,
    eliminarEvento,
    asistirEvento,
    eliminarAsistente,
    manejarRegistrosEvento
};