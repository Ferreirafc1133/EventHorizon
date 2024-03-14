import express from 'express';
import routes from './routes';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect(process.env.DB_URL!)
  .then(() => console.log('Conexión a MongoDB exitosa'))
  .catch((err: Error) => console.error('Error conectando a MongoDB', err));

app.use(routes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
