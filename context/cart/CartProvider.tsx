import { FC, useEffect, useReducer, useState } from 'react';
// Con este paquete toca instalar las dependencias de desarrollo
import Cookie from 'js-cookie'


import { CartContext, cartReducer } from './';
import { ICartProduct, IOrder, ShippingAddress } from '@/interfaces';
import { tesloApi } from '@/api';
import axios from 'axios';




export interface CartState {
   isLoaded: boolean;
   cart: ICartProduct[];
   numberOfItem: number;
   subTotal: number;
   tax: number;
   total: number;

   shippingAddress?: ShippingAddress;
}

const CART_INITIAL_STATE:CartState = {
   isLoaded: false,
   cart:[],
   numberOfItem: 0,
   subTotal: 0,
   tax: 0,
   total: 0,
   shippingAddress: undefined
}



interface Props {
   children: JSX.Element | JSX.Element[] 
}
export const CartProvider:FC<Props> = ({children}) => {


   const [initialCookie, setInitialCookie] = useState(true)
   const [initialAddress, setInitialAddress] = useState(true)
   const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE)


   // Este código puede estar malo
   useEffect(() => {
      try {
         const cartCookie = Cookie.get('cart') ? JSON.parse(Cookie.get('cart')!) : []
         dispatch({type: 'Cart - LoadCart from cookies | storage', payload: cartCookie})
      } catch (error) {
         dispatch({type: 'Cart - LoadCart from cookies | storage', payload: []})
      }
      setInitialCookie(false);

   }, [])

   

   useEffect(() => {
      console.log({carrito:state.cart})
      if(initialCookie) return;
      Cookie.set('cart', JSON.stringify(state.cart))
      
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [state.cart])

// ------------------------------------------------------------

   useEffect(() => {
      // try {

         if(Cookie.get('firsName')){
            const addressCookie = {
               firsName : Cookie.get('firsName') || '',
               lastName : Cookie.get('lastName') || '',
               address  : Cookie.get('address') || '',
               address2 : Cookie.get('address2') || '',
               zip      : Cookie.get('zip') || '',
               city     : Cookie.get('city') || '',
               country  : Cookie.get('country') || '',
               phone    : Cookie.get('phone') || '',
            }
   
            dispatch({type: 'Cart - LoadAddress from cookies | storage', payload: addressCookie})
         
         }

      // } catch (error) {
      //    dispatch({type: 'Cart - LoadAddress from cookies | storage', payload: undefined})
      // }
      // setInitialAddress(false);

   }, [])

   

   // useEffect(() => {
   //    if(initialAddress) return;
   //    // Cookie.set('cart', JSON.stringify(state.cart))
   //    Cookie.set('firsName', JSON.stringify(state.shippingAddress?.firsName) || '');
   //    Cookie.set('lastName', JSON.stringify(state.shippingAddress?.lastName) || '');
   //    Cookie.set('address', JSON.stringify(state.shippingAddress?.address) || '');
   //    Cookie.set('address2', JSON.stringify(state.shippingAddress?.address2) || '');
   //    Cookie.set('zip', JSON.stringify(state.shippingAddress?.zip) || '');
   //    Cookie.set('city', JSON.stringify(state.shippingAddress?.city) || '');
   //    Cookie.set('country', JSON.stringify(state.shippingAddress?.country) || '');
   //    Cookie.set('phone', JSON.stringify(state.shippingAddress?.phone) || '');
      
   // // eslint-disable-next-line react-hooks/exhaustive-deps
   // }, [state.shippingAddress])


   

   useEffect(() => {

      const numberOfItem = state.cart.reduce((prev, current) => current.quantity + prev, 0)
      const subTotal = state.cart.reduce((prev, current) => (current.price * current.quantity) + prev, 0)
      const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0 );
      const orderSummary = {
         numberOfItem,
         subTotal,
         tax: taxRate * subTotal,
         total: (taxRate + 1) * subTotal

      }

      dispatch({type:'Cart - Update order summary', payload: orderSummary});
      console.log({orderSummary})
   
   }, [state.cart])



   const addProductToCart = (product: ICartProduct) => {
      console.log({state});


      const isProductinCart = state.cart.some(prew => prew._id === product._id && prew.size === product.size );
      if (!isProductinCart) return dispatch({type: 'Cart - Update products in cart', payload: [...state.cart,product]});

      const newListCart = state.cart.map(productCart => {
         if (productCart._id === product._id && productCart.size === product.size) {
               return {
                  ...product,
                  quantity: productCart.quantity + product.quantity
               }
         }
         return productCart;
      })
      return dispatch({type: 'Cart - Update products in cart', payload: newListCart});

   }


   const updateCartQuantity = (product: ICartProduct) => {
      dispatch({type:'Cart - Change cart quantity', payload: product})
   }

   const removeCartProduct = (product: ICartProduct) => {
      console.log('Entró al provider, product:')
      console.log(product)
      dispatch({type:'Cart - Remove product in cart', payload: product})
   }

   const updateAddress = (address: ShippingAddress) => {

      Cookie.set('firsName', address.firsName)
      Cookie.set('lastName', address.lastName)
      Cookie.set('address', address.address)
      Cookie.set('address2', address.address2 || '')
      Cookie.set('zip', address.zip)
      Cookie.set('city', address.city)
      Cookie.set('country', address.country)
      Cookie.set('phone', address.phone)

      dispatch({type: 'Cart - Update Address', payload: address})  
   }


   const createOrder = async():Promise<{hasError: boolean; message: string}> => {

      if (!state.shippingAddress) {
         throw new Error('No hay direccion de envío') 
      }


      const body:IOrder = {
         orderItems: state.cart.map(p => ({
            _id     :  p._id,
            title   :  p.title,
            size    :  p.size!,
            quantity:  p.quantity,
            slug    :  p.slug,
            image   :  p.image,
            price   :  p.price,
            gender  :  p.gender,
         })),
         shippingAddress: state.shippingAddress,
         numberOfItem: state.numberOfItem ,
         subTotal: state.subTotal ,
         tax: state.tax ,
         total: state.total ,
         isPaid: false
      
      }


      try {
         const { data } = await tesloApi.post<IOrder>('/orders', body);
         // console.log({data})

         //TODO: Dispacth 

         dispatch({type: 'Cart - Order Complete'});
         return {
            hasError: false,
            message: data._id!
         }
         
      } catch (error) {
         if (axios.isAxiosError(error)) {
            return {
               hasError: true,
               message: error.response?.data.message
            }
         }
         return {
            hasError: true,
            message: 'Error no controlado creando la orden, comuniquese con el administrador'
         }
         // console.log('error de createOrder:', {error})   
      }


   }




   return (
      <CartContext.Provider value={{
           ...state,


           // Methods
           addProductToCart,
           updateCartQuantity,
           removeCartProduct,
           updateAddress,


           // Orders
           createOrder
      }}>
           {children}
       </CartContext.Provider>
   )
}

