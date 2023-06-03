import {Typography} from '@mui/material'

import { ShopLayout } from '@/components/layouts'
import { ProductList } from '@/components/products'
import { useProducts } from '@/hooks'
import { FullScreenLoading } from '@/components/ui'
import { useSession } from 'next-auth/react'



export default function HomePage() {

  const {status, data} = useSession()
  console.log({status, data})
  const {products, isError, isLoading} = useProducts({url:'/products'})



 

  return (
    <ShopLayout title={'Teslo-Shop - Home'} pageDescription={'Encuentra los mejores productos de Teslo aquí'} >
        <Typography variant='h1' component='h1'>
          Tienda
        </Typography>
        <Typography variant='h2' sx={{mb:1}} component='h1'>
          Todos los Productos
        </Typography>
       {
        isLoading
          ? <FullScreenLoading />
          : <ProductList 
              products={products} 
            />     
       
       
       }
       

    </ShopLayout>
  )
}
