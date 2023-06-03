import { db } from '@/database'
import { initialData } from '@/database/seed-data'
import { Order, Product, User } from '@/models'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
    message: string
}

export default async function handler (req: NextApiRequest, res: NextApiResponse<Data>) {

    if (process.env.NODE_ENV === 'production'){
        return res.status(400).json({message: 'No se puede acceder en modo de producción'})
    }

    await db.connect()

    await User.deleteMany();
    await User.insertMany(initialData.users);
    

    await Product.deleteMany();
    await Product.insertMany(initialData.products)


    await Order.deleteMany();


    await db.disconnect();


    res.status(200).json({ message: 'Insertada exitosa' })
}
