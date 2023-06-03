import {Typography} from '@mui/material'

import { ShopLayout } from '@/components/layouts'
import { ProductList } from '@/components/products'
import { useProducts } from '@/hooks'
import { FullScreenLoading } from '@/components/ui'



export default function KidPage() {

  const {products, isError, isLoading} = useProducts({url:'/products?gender=men'})


  console.log({products})
 

  return (
    <ShopLayout title={'Teslo-Shop - Hombres'} pageDescription={'Encuentra los mejores productos de Teslo para hombres aquí'} >
        <Typography variant='h1' component='h1'>
          Tienda
        </Typography>
        <Typography variant='h2' sx={{mb:1}} component='h1'>
          Productos Para Hombres
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
