import { db } from '@/database';
import { IOrder } from '@/interfaces';
import { Order, Product } from '@/models';
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth';
import { getSession } from 'next-auth/react';
import { authOptions } from '../auth/[...nextauth]';

type Data = 
|   {message: string}
|   IOrder

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'POST':
            return orderCreate(req, res);
    
        default:
            return res.status(404).json({message: 'Bad - Request'});
    }


}


const  orderCreate = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

    // el as sirve para poder decirle que me trate un dato como otro, sin que lo sea necesariamente
    const {orderItems, total} =  req.body as IOrder;

    // const session = await getSession({req});
    const session: any = await getServerSession(req, res, authOptions);
    console.log('Esta es la session desde el endpoint: ',{session});


    if (!session) {
        return res.status(400).json({message: 'No hay una session existente'})
    }

    const productsIds = orderItems.map( product => product._id)

    await db.connect();
    const dbProducts = await Product.find({_id: { $in: productsIds} });


    try {
        
        const subTotal = orderItems.reduce((prev, current) => {
            const currenPrice = dbProducts.find(prod => prod.id === current._id)!.price;
            // Este es un error que nunca deberia de activarse
            if(!currenPrice){
                console.log('error en index - order')

                throw new Error('Hubo un error con el precio de los productos, revisar carrito inmediatamente')
            }

            return (current.price * current.quantity) + prev 

        }, 0)

        const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0 );
        const backendTotal = subTotal * (taxRate + 1)

        if (total !== backendTotal) {
            throw new Error('No se pudo realizar la valorización sincronizada')
        }

        //TODO bien hasta aquí

        const userId = session.user._id
        const newOrder = new Order({
                ...req.body,
                isPaid: false, 
                user: userId
            })
        newOrder.total = Math.round(newOrder.total * 100) / 100
        
        await newOrder.save();
        await db.disconnect();
        


        return res.status(200).json(newOrder)


        
    } catch (error:any) {
        await db.disconnect();

        console.log('Error desde el trycacht de index order',{error})

        return res.status(400).json({
            message: error.message || 'revise logs del servidor'
        })
    }


    // console.log({dbProducts});


    // return res.status(201).json({message: 'ok'});
}

