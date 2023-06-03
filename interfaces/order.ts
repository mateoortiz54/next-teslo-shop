import { ISize, IUser } from "./";

export interface IOrder {
    _id?       : string; //Es opcional
    user?     : IUser | string;
    orderItems: IOrderItem[];
    shippingAddress: ShippingAddress;
    paymentResult?: string;


    numberOfItem: number;
    subTotal    : number;
    tax         : number;
    total       : number;


    isPaid      : boolean;
    paidAt?     : string;
    
    transactionId?: string;


    createdAt?   : string; 
    updateAt?    : string;

}

export interface IOrderItem {
    _id     : string;
    title   : string;
    size    : ISize;
    quantity: number;
    slug    : string;
    image   : string;
    price   : number;
    gender  : string; 
}

export interface ShippingAddress {
    firsName : string;
    lastName : string;
    address  : string;
    address2?: string;
    zip      : string;
    city     : string;
    country  : string;  
    phone    : string
 }