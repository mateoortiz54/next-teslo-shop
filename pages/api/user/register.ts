import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs';


import { db } from '@/database';
import { User } from '@/models';
import { jwt, validations } from '@/utils';

type Data = 
|   {message: string}
|   {
        token?: string, 
        message: string, 
        user: {
            email: string,
            name: string,
            role: string
        } 
    }

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'POST':
            return loginUser(req, res);
    
        default:
            return res.status(404).json({message: 'Bad Request'})
    }


}

async function loginUser(req: NextApiRequest, res: NextApiResponse<Data>) {
    
    const {email = '', password= '', name = ''} = req.body as {email: string; password: string; name: string;};

    
    if (password.length < 6) {
        await db.disconnect();
        return res.status(404).json({message: 'La contraseña debe de tener como minimo 6 letras'})
    }
    
    if (name.length < 2) {
        await db.disconnect();
        return res.status(404).json({message: 'El nombre debe de tener 2 o mas letras'})
    }

    if(!validations.isValidEmail(email)){
        await db.disconnect();
        return res.status(404).json({message: 'Dirección de correo no válido'})
    }
    
    //TODO: validación de email
    //if(email)
    
    await db.connect();
    const user = await User.findOne({email}).lean();
    
    
    if (user) {
        await db.disconnect();
        return res.status(404).json({message: 'Ese Correo ya está registrado'})
    }


    const newUser = new User({
        name,
        email: email.toLocaleLowerCase(),
        password: bcrypt.hashSync(password),
        role: 'client'
    });


    try {
        await newUser.save({validateBeforeSave:true});
    } catch (error) {
        console.log({error})
        return res.status(500).json({message: 'Error interno, revisar log del servidor'})
    }

    const {role, _id} = newUser;
    const token = jwt.signToken(_id, email);

    return res.status(200).json({
        message: 'Usuario registrado exitosamente',
        token,
        user: {
            email,
            name,
            role
        }
    
    });
};
