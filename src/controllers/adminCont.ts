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
    try{
        const users = await User.find({}).lean();
        res.render('users', {
            title: "Usuarios_Admin",
            customCss:"/public/styles/listusers.css",
            showNavbar: true,
            users
        });
    } catch(err){
        console.log("Error al listar usuarios", err);
        res.status(ResponseStatus.INTERNAL_SERVER_ERROR).send("Error al listar usuarios");
    }
    //res.status(200).json({ mensaje: "Consulta de todos los usuarios realizada" });
};

const getUserById = async (req: Request, res: Response) => {
    try{
        const { id } = req.params
        console.log(id);
        const user = await User.findById(id).lean();
        //console.log(user);
        res.render('useredit_admin', {
            title:"Editar Usuario (admin)",
            customCss:"/public/styles/edituser.css",
            showNavbar: true,
            user
        })
    } catch(err){
        console.log("Error al mostrar usuario", err);
        res.status(ResponseStatus.INTERNAL_SERVER_ERROR).send("Error al mostrar usuario");
    }
    //console.log("funciona");
    //res.status(200).json({ mensaje: "Consulta de usuario por ID realizada" });
};

const updateUserById = async (req: Request, res: Response) => {
    try {
        const { userId, newData } = req.body;
        if (!userId || !newData) {
            return res.status(400).json({ message: 'userId and newData are required' });
        }

        const updatedUser = await User.findByIdAndUpdate(userId, newData, { new: true, runValidators: true });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send('Error updating user');
    }
    //res.status(200).json({ mensaje: "Actualización de usuario por ID realizada" });
};

const deleteUserById = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;
        await User.deleteOne({ _id: userId });
        res.status(200).send("Usuario eliminado exitosamente");
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send('Error eliminando usuario');
    }
    //res.status(200).json({ mensaje: "Eliminación de usuario por ID realizada" });
};


export {
    getUsers,
    getUserById,
    updateUserById,
    deleteUserById,
    cambiarRolUsuario
};


