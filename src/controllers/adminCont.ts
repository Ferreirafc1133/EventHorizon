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

const cambiarRolUsuario = async (req: Request, res: Response) => {
    try {
        const { userId, role } = req.body; 
        if (!userId || !role) {
            return res.status(400).json({ mensaje: 'Se requiere userId y role' });
        }
        const rolesPermitidos = ['user', 'admin', 'otroRol'];
        if (!rolesPermitidos.includes(role)) {
            return res.status(400).json({ mensaje: 'Rol no válido' });
        }
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { role: role },
            { new: true, runValidators: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        const { password, ...updatedUserInfo } = updatedUser.toObject();
        res.status(200).json(updatedUserInfo);
    } catch (err) {
        console.error('Error al cambiar el rol del usuario:', err);
        res.status(500).send('Error al cambiar el rol del usuario');
    }
};

const getUsers = async (req: Request, res: Response) => {
    res.status(200).json({ mensaje: "Consulta de todos los usuarios realizada" });
};

const getUserById = async (req: Request, res: Response) => {
    res.status(200).json({ mensaje: "Consulta de usuario por ID realizada" });
};

const updateUserById = async (req: Request, res: Response) => {
    res.status(200).json({ mensaje: "Actualización de usuario por ID realizada" });
};

const deleteUserById = async (req: Request, res: Response) => {
    res.status(200).json({ mensaje: "Eliminación de usuario por ID realizada" });
};


export {
    getUsers,
    getUserById,
    updateUserById,
    deleteUserById,
    cambiarRolUsuario
};


