import type { NextApiRequest, NextApiResponse } from 'next'
import { IUser } from '@/interfaces';
import { db } from '@/database';
import { Select } from '@mui/material';
import { User } from '@/models';
import { isValidObjectId } from 'mongoose';

type Data = 
|   { message: string}
|   IUser[]


export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
            
            return getUsers(req, res)
        case 'PUT':
            console.log('Entró al put')
            return postUsers(req, res)
        default:
            break;
    }


    res.status(200).json({ message: 'Example' })
}

const getUsers = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

    await db.connect();

    const users = await User.find().select('-password').lean()

    await db.disconnect();



    return res.status(200).json(users)
}




const postUsers = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

    const {userId = '', role='' } = req.body; 


    if(!isValidObjectId(userId)){
        return res.status(400).json({message: 'No existe usuario por ese id'})
    }


    const validRoles = ['client', 'super-user', 'SEO', 'admin']

    if (!validRoles.includes(role)) {
        return res.status(400).json({message: 'Rol no permitido: ' + validRoles.join(', ') })
    }


    await db.connect();

    const user = await User.findById(userId);


    if (!user) {
        await db.disconnect();

        return res.status(404).json({message: 'Usuario no encontrado'})
    }

    user.role= role;
    await user.save();
    await db.disconnect();
    

    return res.status(200).json({message: 'Usuario actualizado'})

}

