import { db } from '@/database';
import { IProduct } from '@/interfaces'
import { Product } from '@/models';
import { isValidObjectId } from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next'
import {v2 as cloudinary} from 'cloudinary';




cloudinary.config(process.env.CLOUDINARY_URL || '');




type Data = 
|   {message: string}
|   IProduct[]
|   IProduct

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {


    switch (req.method) {
        case 'GET':
            return getProducts(req, res)

        case 'PUT':
            return updateProduct(req, res)            
        
        case 'POST':
            return createProduct(req, res)            

        default:
            break;
    }


    res.status(200).json({ message: 'Example' })
}

const getProducts = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

    await db.connect();

    const products = await Product.find()
                    .sort({title: 'asc'})
                    .lean()




    await db.disconnect();

    const updatedProducts = products.map(product =>{
        product.images = product.images.map(img => {
            return img.includes('https') ? img : `${process.env.HOST_NAME}products/${img}`
        });

        return product;

    })



    return res.status(200).json(updatedProducts)
}



const updateProduct = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

    const  {_id= '', images= []} = req.body as IProduct



    if (!isValidObjectId(_id)) {
        return res.status(400).json({message: 'El id del producto no es válido'})
    }
    
    if (images.length<2) { // No deberia de decir que menor solamente?
        return res.status(400).json({message: 'No hay suficientes imagenes, 2 como minimo'})
    }

    // TODO: posiblemente tendremos un localhost:3000/products/asdasd.jpg


    try {
        
        await db.connect();

        const product = await Product.findById(_id);

        if (!product) {
            return res.status(400).json({message: 'No existe producto con ese id'})
            
        }

        // TODO: eliminar fotos en Cloudinary, o mejor dicho filtrar
        //https://res.cloudinary.com/djnhtdc3n/image/upload/v1685820630/lnagualjsfkjoh1al9bp.webp
        product.images.forEach(async(image) => {
            if (!images.includes(image)) {
                // Borrar de cloudinary
                const [fileId, extension] = image.substring(image.lastIndexOf('/') + 1 ).split('.');
                console.log({image, fileId, extension});
                await cloudinary.uploader.destroy(fileId);
            }
        })


        await product.updateOne(req.body);
        await db.disconnect();
        
        return res.status(200).json(product)
    } catch (error) {
        console.log(error);
        await db.disconnect();
        return res.status(400).json({message: 'Revisar logs del servidor'})

        
    }


}

const createProduct = async(req: NextApiRequest, res: NextApiResponse<Data>) =>{

    const {images=[]} = req.body as IProduct;



    if (images.length<2) { // No deberia de decir que menor solamente?
        return res.status(400).json({message: 'No hay suficientes imagenes, 2 como minimo'})
    }

    try {
        await db.connect();

        const producInDB = await Product.findOne({slug: req.body.slug});

        if (producInDB) {
            await db.disconnect();
            return res.status(400).json({message: 'Ya existe un producto con ese slug'})
        }



        const product = new Product(req.body);
        await product.save();
        await db.disconnect();


        return res.status(200).json(product);

    } catch (error) {
        console.log(error);
        await db.disconnect();
        return res.status(400).json({message: 'Revisar logs del servidor'})
    }



}

