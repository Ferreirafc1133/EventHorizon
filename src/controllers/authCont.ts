import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import User from '../models/userMod';
import { ResponseStatus } from '../utils/response-status';
import jwt from 'jsonwebtoken';


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

        user = new User({
            fullname,
            username,
            email,
            password 
        });

        await user.save();
        console.log(`Usuario ${username} creado exitosamente.`);

        res.redirect('/login');
    } catch (err) {
        console.error('Error durante el registro:', err);
        res.status(ResponseStatus.INTERNAL_SERVER_ERROR).send('Error del servidor');
    }
};


const loginUser = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        console.log(`Inicio de sesión: ${username}`);

        let user = await User.findOne({ username });
        if (!user) {
            console.log(`El usuario ${username} no existe.`);
            return res.status(400).json({ message: 'El usuario no existe' });
        }

        console.log(`Usuario ${username} encontrado. Comparando contraseña...`);

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            console.log(`Contraseña incorrecta para el usuario: ${username}`);
            return res.status(400).json({ message: 'Contraseña incorrecta' });
        }

        const token = jwt.sign(
            { userId: user._id, username: user.username }, 
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        console.log(`Usuario ${username} autenticado exitosamente con token.`);
        res.cookie('token', token, { httpOnly: true, secure: true });
        res.redirect('/');
    } catch (error) {
        console.error('Error durante el inicio de sesión:', error);
        res.status(500).send('Error del servidor');
    }
};


/*
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
*/


const logoutUser = (req: Request, res: Response) => {
    console.log('Indicación para cerrar sesión enviada al cliente.');
    res.send(`
        <script>
            localStorage.removeItem('token');
            sessionStorage.removeItem('token'); // Si también pudiera estar en sessionStorage
            alert('Sesión cerrada exitosamente.');
            window.location.href = '/login';
        </script>
    `);
};

const verPerfil = async (req: Request, res: Response) => {
    try {

        const user = await User.findById(req.usuario.userId);

        if (!user) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        const { password, ...userWithoutPassword } = user.toObject();
        res.status(200).json(userWithoutPassword);
    } catch (err) {
        console.error('Error al obtener el perfil del usuario:', err);
        res.status(500).send('Error al obtener el perfil del usuario');
    }
};


const editarPerfil = async (req: Request, res: Response) => {
    try {
        const userId = req.usuario?.userId;

        if (!userId) {
            return res.status(400).json({ mensaje: 'No se pudo obtener el ID del usuario del token' });
        }

        const updates = {
            fullname: req.body.fullname,
            username: req.body.username,
            email: req.body.email,
            role: req.body.role
        };

        const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });
        
        if (!updatedUser) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        const { password, ...updatedUserInfo } = updatedUser.toObject();
        res.status(200).json(updatedUserInfo);
    } catch (err) {
        console.error('Error al editar el perfil del usuario:', err);
        res.status(500).send('Error al editar el perfil del usuario');
    }
};


const eliminarUsuario = async (req: Request, res: Response) => {
    try {
        const userId = req.usuario?.userId;

        if (!userId) {
            return res.status(400).json({ mensaje: 'ID del usuario no disponible. Operación no permitida.' });
        }

        await User.findByIdAndDelete(userId);

        res.status(200).send('Usuario eliminado exitosamente');
    } catch (err) {
        console.error('Error al eliminar el usuario:', err);
        res.status(500).send('Error al eliminar el usuario');
    }
};




export {
    loginUser,
    registerUser,
    logoutUser,
    verPerfil,
    editarPerfil,
    eliminarUsuario
};


