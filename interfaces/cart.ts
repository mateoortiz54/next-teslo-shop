import { ISize } from "./products";

export interface ICartProduct {
    _id: string;
    description: string; // Podría borrarla
    image: string;
    // inStock: number; la cantidad de productos en almacen, puede servir
    price: number; // Lo dejamos pero no lo vamos a utilizar ya que se debe de traer de la db
    size?: ISize;
    slug: string;
    title: string;
    // type: ITypes;
    gender: 'men'|'women'|'kid'|'unisex'
    quantity: number;

}

