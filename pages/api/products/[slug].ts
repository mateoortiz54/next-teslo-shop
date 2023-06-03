import { db } from '@/database'
import { IProduct } from '@/interfaces'
import { Product } from '@/models'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = 
|   {message: string}
|   IProduct


export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
            
            return getProductBySlug(res, req)
    
        default:
            return res.status(400).json({message: 'Bad Request'})
    }


}

const  getProductBySlug = async(res: NextApiResponse<Data>, req: NextApiRequest) => {

    await db.connect();

    const {slug} = req.query;

    const searchProduct = await Product.findOne({slug}).lean();

    await db.disconnect();

    if (!searchProduct) {
        return res.status(404).json({message: 'Product No encontrado'})
    }

    searchProduct.images = searchProduct.images.map(img => {
            return img.includes('https') ? img : `${process.env.HOST_NAME}products/${img}`
        });



    return res.status(200).json(searchProduct)

    
}
