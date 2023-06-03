import jwt from 'jsonwebtoken';


export const signToken = (_id: string, email: string) => {

    if(!process.env.JWT_SECRET_SEED){
        throw new Error('No hay semilla disponible de JWT - Revisar variables de entorno')
    }

    return jwt.sign(
        //Payload, información que quiera mandar con el jwt
        {_id, email},

        //Seed
        process.env.JWT_SECRET_SEED,

        //Opcional, parametros adicionales
        {expiresIn: '30d'}
        
    )


}



export const isValidToken = (token: string): Promise<string> => {

    if(!process.env.JWT_SECRET_SEED){
        throw new Error('No hay semilla disponible de JWT - Revisar variables de entorno')
    }

    if (token.length <=10 ) {
        return Promise.reject('JWT no válido - Tamaño')
    }

    return new Promise((resolve, reject) => {
        
        try {

            jwt.verify(token, process.env.JWT_SECRET_SEED || '', (err, payload) => {
                
                if(err) return reject('JWT no válido');

                const {_id} = payload as {_id: string};
                
                resolve(_id);
                
            } );

            
        } catch (error) {
            console.log('Este es el error desde el lado interno del jwt:', error)
            reject('JWT no válido - proceso interno de JWT')
        };

    });

};