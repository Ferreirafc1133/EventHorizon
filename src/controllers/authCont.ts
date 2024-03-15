import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import User from '../models/userMod';
import { ResponseStatus } from '../utils/response-status';

interface UserInterface {
    fullname: string;
    username: string;
    email: string;
    password: string;
}

const registerUser = async (req: Request, res: Response) => {
    try {
        const { fullname, username, email, password }: UserInterface = req.body;

        console.log(`Registrando usuario: ${username}, Email: ${email}, Password: ${password}`);

        let user = await User.findOne({ email });
        if (user) {
            console.log(`El usuario con el email ${email} ya existe.`);
            return res.status(ResponseStatus.BAD_REQUEST).json({ msg: 'El usuario ya existe' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        console.log(`Password hasheada para ${username}: ${hashedPassword}`);

        user = new User({
            fullname,
            username,
            email,
            password: hashedPassword
        });

        await user.save();
        console.log(`Usuario ${username} creado exitosamente.`);

        res.redirect('/login');
    } catch (err) {
        console.error('Error durante el registro:', err);
        res.status(ResponseStatus.INTERNAL_SERVER_ERROR).send('Error del servidor');
    }
};

/*
const loginUser = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        console.log(`Inicio de sesión: ${username}, Password proporcionada: ${password}`);

        let user = await User.findOne({ username });
        if (!user) {
            console.log(`El usuario ${username} no existe.`);
            return res.status(400).render('login', { message: 'El usuario no existe' });
        }

        console.log(`Usuario ${username} encontrado. Comparando contraseña...`);

        const isMatch = await bcrypt.compare(password, user.password);

        console.log(`Resultado de comparación para ${username}: ${isMatch}`);

        if (!isMatch) {
            console.log(`Contraseña incorrecta para el usuario: ${username}`);
            return res.status(400).render('login', { message: 'Contraseña incorrecta' });
        }

        req.session.userId = user._id;
        console.log(`Usuario ${username} autenticado exitosamente.`);

        res.redirect('/');
    } catch (error) {
        console.error('Error durante el inicio de sesión:', error);
        res.status(500).send('Error del servidor');
    }
};
*/


//temporal:
const loginUser = async (req: Request, res: Response) => {
    try {
        const { username } = req.body; 

        console.log(`Intento de inicio de sesión con usuario: ${username}`);

        let user = await User.findOne({ username });
        if (!user) {
            console.log(`El usuario ${username} no existe.`);
            return res.status(400).render('login', { message: 'El usuario no existe' });
        }

        console.log(`Inicio de sesión exitoso para: ${username} (verificación de contraseña omitida)`);

        req.session.userId = user._id;
        req.session.username = user.username;
        console.log(`Sesión iniciada para el usuario: ${username}`);

        res.redirect('/'); 
    } catch (error) {
        console.error('Error durante el inicio de sesión:', error);
        res.status(500).send('Error del servidor');
    }
};



const logoutUser = (req: Request, res: Response) => {
    req.session.destroy((err: any) => {
        if (err) {
            console.error('Error al cerrar la sesión:', err);
            res.status(ResponseStatus.INTERNAL_SERVER_ERROR).send('Error al cerrar la sesión');
        } else {
            console.log('Sesión cerrada exitosamente');
            res.redirect('/login');
        }
    });
};

export {
    loginUser,
    registerUser,
    logoutUser
};


