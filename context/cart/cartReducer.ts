import { ICartProduct, ShippingAddress } from '@/interfaces';
import { CartState } from './';


type CartActionType= 
|    { type: 'Cart - LoadCart from cookies | storage', payload: ICartProduct[]}
|    { type: 'Cart - Update products in cart', payload: ICartProduct[]}
|    { type: 'Cart - Change cart quantity', payload: ICartProduct}
|    { type: 'Cart - Remove product in cart', payload: ICartProduct}
|    { type: 'Cart - LoadAddress from cookies | storage', payload: ShippingAddress }
|    { type: 'Cart - Update Address', payload: ShippingAddress }
|    { 
         type: 'Cart - Update order summary', 
         payload: {
            numberOfItem: number;
            subTotal: number;
            tax: number;
            total: number;
         }
      }
|    {type: 'Cart - Order Complete'}


export const cartReducer = (state: CartState, action: CartActionType): CartState => {

   switch (action.type) {
      case 'Cart - LoadCart from cookies | storage':
         return {
            ...state,
            isLoaded: true,
            cart: [...action.payload]
         }    

      case 'Cart - Update products in cart':

         return {
            ...state,
            cart: action.payload
         }  
      
      case 'Cart - Change cart quantity':
         
         return {
            ...state,
            cart: state.cart.map(prod => {
               if (prod._id !== action.payload._id ) return prod;    
               if (prod.size !== action.payload.size ) return prod;    
               
               return action.payload
            })

         }
      case 'Cart - Remove product in cart':
      
         return {
            ...state,
            cart: state.cart.filter(prod => !(prod._id === action.payload._id && prod.size === action.payload.size) )

         }

      case 'Cart - Update order summary':
      
         return {
            ...state,
            ...action.payload

         }
         
      case 'Cart - Update Address':
      case 'Cart - LoadAddress from cookies | storage':
         return {
            ...state,
            shippingAddress: action.payload

         }  
       
      case 'Cart - Order Complete':
         return {
            ...state,
            cart: [],
            numberOfItem: 0,
            subTotal: 0,
            tax: 0,
            total: 0
         }
      

      default:
         return state;
   }

}