import React, { useContext, useEffect } from 'react'
import { useRouter } from 'next/router';



import { Grid, Typography, Card, CardContent, Divider, Box, Button } from '@mui/material';

import { CardList, OrderSummary } from '@/components/cart';
import { ShopLayout } from '@/components/layouts'
import { CartContext } from '@/context';

const CartPage = () => {

    const {isLoaded, numberOfItem, cart} = useContext(CartContext)
    const router = useRouter();

    useEffect(() => {
      if (isLoaded && cart.length === 0) {
            router.replace('/cart/empty');
      }
    }, [isLoaded, cart, router])

    if(!isLoaded || cart.length === 0){
        return (<></>)
    }
    


  return (

    <ShopLayout title='carrito - 3' pageDescription='Carrito de Compras de la tienda' >

        <Typography variant='h1' component='h1'>Carrito</Typography>

        <Grid container>
            <Grid item xs={12} sm={7}>
                <CardList editable/>
            </Grid>
            <Grid item xs={12} sm={5}>
                <Card className='summary-card'>
                    <CardContent>
                        <Typography variant='h2' >Orden</Typography>
                        <Divider sx={{my:1}} />

                        <OrderSummary/>

                        <Box sx={{mt:3}}>
                            <Button 
                                color='secondary' 
                                className='circular-btn' 
                                fullWidth 
                                href='/checkout/address'

                            >
                                Checkout
                            </Button>
                        </Box>


                    </CardContent>
                </Card>
            </Grid>

        </Grid>

    </ShopLayout>



  )
}

export default CartPage