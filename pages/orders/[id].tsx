import { useState } from 'react';
import NextLink from 'next/link';
import { Grid, Typography, Card, CardContent, Divider, Box, Link, Chip, CircularProgress } from '@mui/material';
import { GetServerSideProps } from 'next'
import { PayPalButtons } from "@paypal/react-paypal-js";
import { getSession } from 'next-auth/react';

import { CardList, OrderSummary } from '@/components/cart';
import { ShopLayout } from '@/components/layouts'
import { CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';
import { dbOrders } from '@/database';
import { IOrder } from '@/interfaces';
import tesloApi from '../../api/tesloApi';
import { useRouter } from 'next/router';


export type OrderResponseBody =  {

    id: string;
    status: 
        | "COMPLETED"
        | "SAVED"
        | "APPROVED"
        | "VOIDED"
        | "PAYER_ACTION_REQUIRED"
        | "CREATED"

};




interface Props {
    order: IOrder;

}


const OrderPage = ({order}: Props) => {

    const {shippingAddress} = order;
    const router = useRouter();
    const [isPaying, setIsPaying] = useState(false);


    const onOrderCompleted = async(details: OrderResponseBody) => {
        
        if (details.status !== 'COMPLETED' ) {
            return alert('No hay Pago en Paypal');
        };
        setIsPaying(true)

        try {
            const {data} = await tesloApi.post(`/orders/pay`, {
                transactionId : details.id,
                orderId       :  order._id
            })

            router.reload();


        } catch (error) {
            setIsPaying(true)
            console.log(error)
            alert('Error')
        }
        
    };




  return (

    <ShopLayout title='Resumen de la orden 432425' pageDescription='Resumen de orden' >

        <Typography variant='h1' component='h1'>Orden: {order._id}</Typography>

        {
            order.isPaid 
            ? (
                <Chip
                    sx={{my:2}}
                    label='Orden Pagada'
                    variant='outlined'
                    color='success'
                    icon={<CreditScoreOutlined/>}
                />

            )
            :(
                <Chip
                    sx={{my:2}}
                    label='Pendiente de Pago'
                    variant='outlined'
                    color='error'
                    icon={<CreditCardOffOutlined/>}
                />
                

            )
        }




        <Grid container>
            <Grid item xs={12} sm={7}>
                <CardList products={order.orderItems} />
            </Grid>
            <Grid item xs={12} sm={5}>
                <Card className='summary-card'>
                    <CardContent>
                        <Typography variant='h2' >Resumen ({order.numberOfItem} {order.numberOfItem > 1 ? 'Productos' : 'Producto'})</Typography>
                        <Divider sx={{my:1}} />


                        <Box display='flex' justifyContent='space-between' >
                            <Typography variant='subtitle1'>Dirección de Entrega</Typography>

                            {/* <NextLink href='/checkout/addres' passHref legacyBehavior>
                                <Link underline='always'>
                                    Editar
                                </Link>
                            </NextLink> */}
                        </Box>



                        <Typography>{shippingAddress.firsName} {shippingAddress.lastName}</Typography>
                        <Typography>{shippingAddress.address} {shippingAddress.address2 && `, ${shippingAddress.address2}`}  </Typography>
                        <Typography>{shippingAddress.city}, {shippingAddress.zip}</Typography>
                        <Typography>{shippingAddress.country}</Typography>
                        <Typography>{shippingAddress.phone}</Typography>

                        <Divider sx={{my:1}}/>
                        <Box display='flex' justifyContent='end' >
                            <NextLink href='/cart' passHref legacyBehavior>
                                <Link underline='always'>
                                    Editar
                                </Link>
                            </NextLink>
                        </Box>


                        <OrderSummary order={order}/> 

                        <Box sx={{mt:3}} display='flex' flexDirection='column'>
                            {/* <Button color='secondary' className='circular-btn' fullWidth >
                                Confirmar Orden
                            </Button> */}
                            {/* TODO */}
                            <Box 
                                display='flex' 
                                justifyContent='center' 
                                className='fadeIn'
                                sx={{display: isPaying? 'flex' : 'none'}}
                            >
                                <CircularProgress/>
                            </Box >

                            <Box sx={{display: isPaying? 'none' : 'flex', flex: 1}} flexDirection='column'>
                                {
                                    order.isPaid 
                                    ? (
                                        <Chip
                                            sx={{my:2}}
                                            label='Orden Pagada'
                                            variant='outlined'
                                            color='success'
                                            icon={<CreditScoreOutlined/>}
                                        />)
                                    :(
                                        
                                        <PayPalButtons 
                                            createOrder={(data, actions) => {
                                                return actions.order.create({
                                                    purchase_units: [
                                                        {
                                                            amount: {
                                                                value: `${order.total}`,
                                                            },
                                                        },
                                                    ],
                                                });
                                            }}
                                            onApprove={(data, actions) => {
                                                return actions.order!.capture().then((details) => {
                                                    onOrderCompleted(details);
                                                    // console.log({details})
                                                    // const name = details.payer.name?.given_name ;
                                                    // alert(`Transaction completed by ${name}`);
                                                });
                                            }}
                                        />
                                        
                                    )
                                }
                            </Box>


                        </Box>


                    </CardContent>
                </Card>
            </Grid>

        </Grid>

    </ShopLayout>



  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({req, query, res}) => {


    const {id = ''} = query
    // const session: any = await getServerSession(req, res, authOptions);

    const session:any = await getSession({req})

    if (!session) {
        return{
            redirect: {
                destination: `/auth/login?p=/orders/${id}`,
                permanent: false
            }
        }
    }


    const order = await dbOrders.getOrderById(id.toString());


    if (!order) {
        return {
            redirect: {
                destination: `/orders/history`,
                permanent: false
            }
        }
    }

    if (order.user !== session.user._id) {
        return {
            redirect: {
                destination: `/orders/history`,
                permanent: false
            }
        }
    }


    return {
        props: {
            order            
        }
    }
}



export default OrderPage