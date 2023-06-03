import { FC, useEffect, useReducer } from 'react';
import { AuthContext, authReducer } from './';
import { IUser } from '@/interfaces';
import { tesloApi } from '@/api';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';


export interface AuthState {
   isLoggedIn: boolean;
   user?: IUser;
}
interface Props {
   children: JSX.Element | JSX.Element[] 
}


const AUTH_INITIAL_STATE:AuthState = {
   isLoggedIn: false,
   user: undefined
}



export const AuthProvider:FC<Props> = ({children}) => {

   const [state, dispatch] = useReducer(authReducer, AUTH_INITIAL_STATE)
   // const router = useRouter();
   const {data, status} = useSession();


   useEffect(() => {
      if (status === 'authenticated') {
         // console.log({data, status})
         // const {} = data.user;
         dispatch({type:'Auth - Login', payload: data?.user as IUser})
      }

   }, [data, status])
   

   // Autenticación personalizada, intercambiada por nextAuth
   // useEffect(() => {
   //    checkToken();
     
   // }, [])
   
   const checkToken = async() => {
      if(!Cookies.get('token'))return;

      try {
         const {data} = await tesloApi.get('/user/validate-jwt');
         const {token, user, message} = data;

         Cookies.set('token', token);
         dispatch({type:'Auth - Login', payload: user})

      } catch (error) {
         Cookies.remove('token')
      }



      // Llamar al endpoint
      // Revalidar token guardando el nuevo
      // dispatch login

      //Mal
      // Borrar el token de las cookies
      
   }




   const loginUser = async(email:string, password:string):Promise<boolean> =>{
      
      try {
         const {data} = await tesloApi.post('/user/login', {email, password})
         const {token, user} = data;

         Cookies.set('token', token)
         dispatch({type: 'Auth - Login', payload: user})
         return true;

      } catch (error) {
         return false;
      }


   }


   const registerUser = async(name:string, email:string, password:string):Promise<{hasError:boolean; message?:string}> => {
   
      try {
         const {data} = await tesloApi.post('/user/register', {name, email, password})
         const {token, user} = data;

         Cookies.set('token', token)
         dispatch({type: 'Auth - Login', payload: user})
         return {
            hasError: false,
         };

      } catch (error) {
         if (axios.isAxiosError(error)) {
            return {
               hasError: true, 
               message: error.response?.data.message
            
            }
         }

         return {
            hasError: true,
            message: 'No se pudo crear el usuario - Intente de nuevo'
         };
      }
   
   }



   const logout = () => {
   
      Cookies.remove('cart');
      Cookies.remove('firsName')
      Cookies.remove('lastName')
      Cookies.remove('address')
      Cookies.remove('address2')
      Cookies.remove('zip')
      Cookies.remove('city')
      Cookies.remove('country')
      Cookies.remove('phone')

      signOut();
      // Debemos de purgar todo lo que haya en el CartContext
      // router.reload();
      // Cookies.remove('token');

   }



   return (
      <AuthContext.Provider value={{
           ...state,

           //Methods
           loginUser,
           registerUser,
           logout
      }}>
           {children}
       </AuthContext.Provider>
   )
}