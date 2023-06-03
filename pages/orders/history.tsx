import NextLink from 'next/link';
import { GetServerSideProps } from 'next'

import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid"

import { ShopLayout } from "@/components/layouts"
import { Chip, Grid, Typography, Link } from '@mui/material';
import { getSession } from 'next-auth/react';
import { dbOrders } from '@/database';
import { IOrder } from '@/interfaces';


const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'fullname', headerName: 'Nombre Completo', width: 300 },
    {
        field: 'paid',
        headerName: 'Pagada',
        description: 'Muestra información sobre el estado de pago',
        width: 200,
        renderCell: (params: GridRenderCellParams ) => {
            return (
                params.row.paid
                ? <Chip color="success" label='Pagada' variant="outlined" />    
                : <Chip color="error" label='No Pagada' variant="outlined" />    
            )
        }

    },
    {
        field: 'link',
        headerName: 'Link',
        description: 'Seguir el link para más información sobre el pedido',
        sortable: false,
        width: 200,
        renderCell: (params: GridRenderCellParams ) => (
                <NextLink href={`/orders/${params.row.orderId}`} passHref legacyBehavior>
                    <Link underline="always">
                        Más información...
                    </Link>
                </NextLink>
            )

    },

];
  
// const oldRows = [
//     { id: 1, paid: false, fullname: 'Mateo Ortiz' },
//     { id: 2, paid: true, fullname: 'Andres Felipe' },
//     { id: 3, paid: true, fullname: 'Cristian Arboleda' },
//     { id: 4, paid: false, fullname: 'Sebastian Pertuz' },
//     { id: 5, paid: true, fullname: 'Johan quienSabeQue' },
//     { id: 6, paid: false, fullname: 'Blenck Martinez' }

// ];
  

interface Props {
    orders: IOrder[]
}

const HistoryPage = ({orders}: Props) => {
    
    const rows = orders.map((order, index) =>  {
        return {id: index + 1, paid: order.isPaid, fullname:`${order.shippingAddress.firsName} ${order.shippingAddress.lastName}`, orderId: order._id}  
    
    })



  return (
    <ShopLayout title={"Historial de ordenes"} pageDescription={"Historial de ordenes del cliente"} >
        <Typography variant="h1" component='h1'>Historial de ordenes</Typography>

        <Grid container className='fadeIn'>
            <Grid item xs={12} sx={{height: 650, width: '100%'}}>
                <DataGrid 
                    rows={ rows }
                    columns={ columns }
                    initialState={{
                    pagination: { 
                        paginationModel: { pageSize: 5 } 
                    },
                    }}
                    pageSizeOptions={[5, 10, 25]}
                    
                />

            </Grid>
        </Grid>


    </ShopLayout>
  )
}


export const getServerSideProps: GetServerSideProps = async ({req, res}) => {
    const session:any = await getSession({req})

    if (!session) {
        return {
            redirect: {
                destination: '/auth/login?p=/orders/history',
                permanent: false
            }
        }
    
    }

    // Lo encontró
    const orders = await dbOrders.getOrdersByUser(session.user._id)


    return {
        props: {
            orders
        }
    }
}


export default HistoryPage