import { Grid, Typography, Card, CardContent, Divider, Box, Link, Chip, CircularProgress } from '@mui/material';
import { GetServerSideProps } from 'next'

import { CardList, OrderSummary } from '@/components/cart';
import { AdminLayout, ShopLayout } from '@/components/layouts'
import { AirplaneTicketOutlined, CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';
import { dbOrders } from '@/database';
import { IOrder } from '@/interfaces';



interface Props {
    order: IOrder;

}


const OrderPage = ({order}: Props) => {

    const {shippingAddress} = order;

  return (

    <AdminLayout 
        title='Resumen de la orden 432425' 
        subTitle={`OrderId: ${order._id}`} 
        icon={<AirplaneTicketOutlined/>}
    >


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
                        {/* <Box display='flex' justifyContent='end' >
                            <NextLink href='/cart' passHref legacyBehavior>
                                <Link underline='always'>
                                    Editar
                                </Link>
                            </NextLink>
                        </Box> */}


                        <OrderSummary order={order}/> 

                        <Box sx={{mt:3}} display='flex' flexDirection='column'>
                            {/* <Button color='secondary' className='circular-btn' fullWidth >
                                Confirmar Orden
                            </Button> */}
                            {/* TODO */}
                           

                            <Box  display={'flex'} flexDirection='column'>
                                {
                                    order.isPaid 
                                    ? (
                                        <Chip
                                            sx={{my:2, flex: 1}}
                                            label='Orden Pagada'
                                            variant='outlined'
                                            color='success'
                                            icon={<CreditScoreOutlined/>}
                                        />)
                                    :(
                                        <Chip
                                            sx={{my:2, flex: 1}}
                                            label='Pendiente'
                                            variant='outlined'
                                            color='error'
                                            icon={<CreditCardOffOutlined/>}
                                        />)
                                }
                            </Box>


                        </Box>


                    </CardContent>
                </Card>
            </Grid>

        </Grid>

    </AdminLayout>



  )
}

// You subTitle use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({req, query, res}) => {


    const {id = ''} = query
    // const session: any = await getServerSession(req, res, authOptions);
    const order = await dbOrders.getOrderById(id.toString());


    if (!order) {
        return {
            redirect: {
                destination: `/admin/orders`,
                permanent: false
            }
        }
    }

    // if (order.user !== session.user._id) {
    //     return {
    //         redirect: {
    //             destination: `/orders/history`,
    //             permanent: false
    //         }
    //     }
    // }


    return {
        props: {
            order            
        }
    }
}



export default OrderPage