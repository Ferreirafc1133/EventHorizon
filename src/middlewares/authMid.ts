import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
const cookieParser = require('cookie-parser');

declare global {
  namespace Express {
    interface Request {
      usuario?: any; 
    }
  }
}
interface DecodedToken {
    userId: string;
    username: string;
}

export const verificarToken = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;

    if (!token) {
        res.status(403).json({ mensaje: 'Se requiere token para autenticación' });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decoded;
        next();
    } catch (error) {
        res.status(401).json({ mensaje: 'Token no válido' });
    }
};

export const establecerContextoAutenticacion = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;

    console.log("Token recibido:", token); 

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken; 
            console.log("Payload decodificado:", decoded); 
            res.locals.userLoggedIn = true;
            res.locals.username = decoded.username; 
        } catch (error) {
            console.error("Error al verificar token:", error); 
            res.locals.userLoggedIn = false;
        }
    } else {
        res.locals.userLoggedIn = false;
    }
    next();
};


