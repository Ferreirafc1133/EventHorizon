import mongoose from 'mongoose';

interface IEvento extends mongoose.Document {
  titulo: string;
  descripcion: string;
  fechaInicio: Date;
  fechaFin: Date;
  activo: boolean;
  organizador: string;
  colaboradores: string[];
}

const eventoSchema = new mongoose.Schema<IEvento>({
  titulo: {
    type: String,
    required: true
  },
  descripcion: {
    type: String,
    required: true
  },
  fechaInicio: {
    type: Date,
    required: true
  },
  fechaFin: {
    type: Date,
    required: true
  },
  activo: {
    type: Boolean,
    required: true,
    default: true 
  },
  organizador: {
    type: String,
    required: true
  },
  colaboradores: {
    type: [String], 
    required: false, 
    default: [] 
  }
});

const Evento = mongoose.model<IEvento>('Evento', eventoSchema);

export default Evento;
