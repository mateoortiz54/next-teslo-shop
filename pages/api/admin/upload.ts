import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';

import {v2 as cloudinary} from 'cloudinary';


cloudinary.config(process.env.CLOUDINARY_URL || '');


type Data = {
    message: string
}

export const config = {
    api: {
        bodyParser: false,
    }
} 

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'POST':
            
            return UploadFile(req, res);
    
        default:
            res.status(400).json({ message: 'Bad Request' })

    }


}


const saveFile =async(file: formidable.File):Promise<string> => {
    //! Para modo de estudio; forma de subir imagenes al proyecto propiamante, no se recomienda
    // const data = fs.readFileSync(file.filepath);
    // fs.writeFileSync(`./public/${file.originalFilename}`, data);

    // fs.unlinkSync(file.filepath);
    // return
    //! ---------------------------------------------------------------------------

    const {secure_url} = await cloudinary.uploader.upload(file.filepath);
    return secure_url;


}



const parseFiles = async(req: NextApiRequest):Promise<string> => {


    return new Promise ((resolve, reject) => {
    
        const form = new formidable.IncomingForm();
        form.parse(req, async(err, fields, files) =>{
        
            console.log({err, fields, files})

            if (err) {
                return reject(err);
            }


            const filepath = await saveFile(files.file as formidable.File)
            resolve(filepath)

        })


    })

}

// como estamos manejando archivos en el body, lo normal es que ts los intentara serializar,
// cosa que no debe pasar en este preciso caso y se lo decimo con el export config
const UploadFile = async(req: NextApiRequest, res: NextApiResponse<Data>) => {


    const imageUrl = await parseFiles(req)

    res.status(200).json({ message: imageUrl })

}
