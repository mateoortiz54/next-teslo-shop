import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/database';
import { Order, Product, User } from '@/models';

type Data = 
| {
    numberOfOrders: number; // ordenes totales
    paidOrders: number; // true
    notPaidOrders: number; // false
    numberOfClients: number; // role: client
    numberOfProducts: number
    productswithNoInventory: number; // 0
    lowInventory: number; // productos con 10 o menos 
    
}
| {message: string}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    

    
    await db.connect();
    const [
        numberOfOrders,
        paidOrders,
        notPaidOrders,
        numberOfClients,
        numberOfProducts,
        productswithNoInventory,
        lowInventory
    
    ] = await Promise.all([
        Order.count(),
        Order.find({isPaid: true}).count(),
        Order.find({isPaid: false}).count(),
        User.count(),
        Product.count(),
        Product.find({inStock: 0}).count(),
        Product.find({inStock:{$lte: 10}}).count(),
        ]
    )
    
    
    
    await db.disconnect();



    res.status(200).json({
        numberOfOrders,
        paidOrders,
        notPaidOrders,
        numberOfClients,
        numberOfProducts,
        productswithNoInventory,
        lowInventory,
    })
    

    // const session: any = await getServerSession(req, res, authOptions);
    
    // if (!session) {
    //     return res.status(400).json({message: 'Acesso denegado'})
    // }

    // const orderItems: Data = {
    //     numberOfOrders  : 0,
    //     paidOrders  : 0,
    //     notPaidOrders   : 0,
    //     numberOfClients : 0,
    //     numberOfProducts    : 0,
    //     productswithNoInventory : 0,
    //     lowInventory    : 0,
    // };
    
    // await db.connect();
    // const ordersDb= await Order.find().lean();
    // const productsDb= await Product.find().lean();
    // const userDb= await User.find().lean();


    // await db.disconnect();

    
    // for (let index = 0; index < ordersDb.length; index++) {
    //     // const element = array[index];
    //     console.log(ordersDb[index])
    //     orderItems.numberOfOrders += 1;
    //     if (ordersDb[index].isPaid) {
    //         orderItems.paidOrders += 1;
    //     } else{
    //         orderItems.notPaidOrders += 1;
    //     }
        
    // }
    // orderItems.numberOfProducts = productsDb.length;

    // for (let index = 0; index < productsDb.length; index++) {
    //     if (productsDb[index].inStock === 0) {
    //         orderItems.productswithNoInventory += 1
    //     }
    //     if (productsDb[index].inStock <= 10) {
    //         orderItems.lowInventory += 1
    //     }
    // }



    // for (let index = 0; index < userDb.length; index++) {
    //     if (userDb[index].role === 'client') {
    //         orderItems.numberOfClients += 1
    //     }
    // }


    // console.log('valores iniciales del objeto a devolver: ',{orderItems})
    // // orderItems =

    
    

}