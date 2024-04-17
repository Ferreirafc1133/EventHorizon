import { Request, Response } from 'express';
import Evento from '../models/eventMod'; 
import { ResponseStatus } from '../utils/response-status';
import User from '../models/userMod'; 

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
        const eventos = await Evento.find({}).lean();
        //console.log(eventos);
        res.render('events', { 
            title: "Eventos",
            customCss: "/public/styles/events.css",
            showNavbar: true,
            eventos });
        //res.json(eventos);
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
    const { username } = req.body;

    try {
        const evento = await Evento.findById(id);
        if (!evento) {
            return res.status(404).send({ mensaje: 'Evento no encontrado.' });
        }

        const usuario = await User.findOne({ username: username });
        if (!usuario) {
            return res.status(404).send({ mensaje: 'Usuario no encontrado.' });
        }

        if (evento.asistentes.includes(usuario._id)) {
            return res.status(400).send({ mensaje: 'El usuario ya está inscrito en el evento.' });
        }

        evento.asistentes.push(usuario._id);
        await evento.save();

        res.status(200).send({ mensaje: `Usuario con id ${usuario._id} ha sido añadido al evento con id ${id}.` });
    } catch (error) {
        res.status(500).send({ mensaje: 'Error al procesar la solicitud.', error: error.message });
    }
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