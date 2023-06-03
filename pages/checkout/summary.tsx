import NextLink from 'next/link';
import { Grid, Typography, Card, CardContent, Divider, Box, Button, Link, Chip } from '@mui/material';


import { CardList, OrderSummary } from '@/components/cart';
import { ShopLayout } from '@/components/layouts'
import { useContext, useEffect, useState } from 'react';
import { CartContext } from '@/context';
import { countries } from '@/utils';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';


const SummaryPage = () => {

    const router = useRouter();


    const {shippingAddress, numberOfItem, createOrder} = useContext(CartContext);
    const [isPosting, setIsPosting] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
      
        if (!Cookies.get('firsName')) {
            router.push('/checkout/address')
            
        }

        if (!Cookies.get('cart') || Cookies.get('cart') === '[]') {

            router.push('/cart/empty')
        }
      
    }, [router])
    

    if (!shippingAddress) {
        return <></>
    }


    const {address, city, country, firsName, lastName, phone, zip, address2 = ''} = shippingAddress;


    const onCreateOrder = async() => {

        setIsPosting(true)

        // dispatch
        const {hasError, message} = await createOrder();

        if (hasError) {
            setIsPosting(false);
            setErrorMessage(message)
            return;
        }
        
        router.replace(`/orders/${message}`)
    }

  return (

    <ShopLayout title='Resumen de orden' pageDescription='Resumen de orden' >

        <Typography variant='h1' component='h1'>Resumen de orden</Typography>

        <Grid container>
            <Grid item xs={12} sm={7}>
                <CardList />
            </Grid>
            <Grid item xs={12} sm={5}>
                <Card className='summary-card'>
                    <CardContent>
                        <Typography variant='h2' >Resumen ({numberOfItem}  {numberOfItem === 1 ? ' Producto' : ' Productos'})</Typography>
                        <Divider sx={{my:1}} />


                        <Box display='flex' justifyContent='space-between' >
                            <Typography variant='subtitle1'>Dirección de Entrega</Typography>

                            <NextLink href='/checkout/addres' passHref legacyBehavior>
                                <Link underline='always'>
                                    Editar
                                </Link>
                            </NextLink>
                        </Box>


                        <Typography>{firsName} {lastName}</Typography>
                        <Typography>{address} {address2? `, ${address2}` : ''}</Typography>
                        <Typography>{city}, {zip}</Typography>
                        {/* <Typography>
                            {
                                // countries.map(countryPrew=>{
                                //     if(countryPrew.code === country){
                                //         return countryPrew.name
                                //     }
                                // })
                                countries.find(c => c.code === country)?.name
                            }
                            </Typography> */}
                        <Typography>{country}</Typography>
                        <Typography>{phone}</Typography>

                        <Divider sx={{my:1}}/>
                        <Box display='flex' justifyContent='end' >
                            <NextLink href='/cart' passHref legacyBehavior>
                                <Link underline='always'>
                                    Editar
                                </Link>
                            </NextLink>
                        </Box>


                        <OrderSummary/> 

                        <Box sx={{mt:3}} display='flex' flexDirection='column'  >
                            <Button 
                                color='secondary' 
                                className='circular-btn' 
                                fullWidth
                                onClick={onCreateOrder}
                                disabled={isPosting}
                            >
                                Confirmar Orden
                            </Button>
                                
                            <Chip 
                                color='error'
                                label={errorMessage}
                                sx={{ display: errorMessage ? 'flex' : 'none', mt: 2}}
                            />



                        </Box>


                    </CardContent>
                </Card>
            </Grid>

        </Grid>

    </ShopLayout>



  )
}

export default SummaryPage