import { IProduct } from '@/interfaces';
import mongoose, {Schema, model, Model} from 'mongoose';


const productSchema =new Schema({

    description:{type: String, required:true, default: ''},
    images:[{type:String}],
    inStock:{type: Number, required:true },
    price:{type: Number, required:true },
    sizes:[{
        type:String,
        enum:{
            values: ['XS','S','M','L','XL','XXL','XXXL'],
            message: '{VALUE} no es un tamaño válido'
        }
    }],
    slug:{type: String, required:true, unique: true },
    tags:[{type:String}],
    title:{type:String, required: true, default: ''},
    type:{
        type:String,
        enum:{
            values: ['shirts','pants','hoodies','hats'],
            message: '{VALUE} no es un tipo válido'
        },
        default: 'shirts'
    },
    gender:{
        type:String,
        enum:{
            values: ['men','women','kid','unisex'],
            message: '{VALUE} no es un genero válido'
        },
        default: 'men'
        
    },

},{
    // Mongoose ya nos provee por si misma la fecha de creación
    // y la fecha de actualización
    timestamps: true

});

// TODO: crear indice de Mongo
// TODO: Esto ayudará a la busqueda de un producto por medio de url.... api/search

productSchema.index({title: 'text', tags: 'text'});


const Product: Model<IProduct> = mongoose.models.Product || model('Product', productSchema)

export default Product;