import { GetServerSideProps } from 'next'

import {Box, Typography} from '@mui/material'

import { ShopLayout } from '@/components/layouts'
import { ProductList } from '@/components/products'
import { useProducts } from '@/hooks'
import { FullScreenLoading } from '@/components/ui'
import { dbProducts } from '@/database'
import { IProduct } from '@/interfaces'

interface Props {
    products: IProduct[];
    query:string;
    foundProducts: boolean;
}

export default function SearchPage({products,foundProducts, query}:Props) {

  return (
    <ShopLayout title={'Teslo-Shop - Home'} pageDescription={'Encuentra los mejores productos de Teslo aquí'} >
        <Typography variant='h1' component='h1'>Buscar Producto</Typography>
        {
            foundProducts 
            ?    <Typography variant='h2' sx={{mb:1}} component='h1'>Término: {query}</Typography>
            : 
                <Box display='flex'>
                    <Typography variant='h2' sx={{mb:1}} textTransform='capitalize'>No encontramos ningún producto con:  </Typography>
                    <Typography variant='h2' sx={{mb:1}} color='secondary' textTransform='capitalize'>{query}</Typography>
                </Box>
        }
        <ProductList 
            products={products} 
        />     
    </ShopLayout>
  )
}


// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({params}) => {
    const { query = '' } = params as {query:string};


    if (query.length === 0 ) {
        return {
            redirect: {
                destination: '/',
                permanent:true
            }
        }
    }

    let products = await dbProducts.getProductsByTerm(query);
    const foundProducts = products.length > 0;

    if (!foundProducts) {
        //TODO: retornar otros productos sugeridos en caso que no hayan resultados de la consulta
        products = await dbProducts.getAllProducts();
    }



    return {
        props: {
            products,
            foundProducts,
            query        
        }
    }
}