import React, { useEffect, useState } from 'react'
import { GetServerSideProps } from 'next'
import { AdminLayout } from '@/components/layouts'
import { AccessTimeOutlined, AttachMoneyOutlined, CancelPresentationOutlined, CategoryOutlined, CreditCardOffOutlined, CreditCardOutlined, DashboardOutlined, GroupOutlined, ProductionQuantityLimitsOutlined } from '@mui/icons-material'
import { Grid, Typography } from '@mui/material';
import { SummaryTile } from '@/components/admin';
import axios from 'axios';
import useSWR from 'swr';
import { DashboardSummaryResponse } from '@/interfaces/dashboard';



// interface OrderInfo  {
 
//     numberOfOrders: number; // ordenes totales
//     paidOrders: number; // true
//     notPaidOrders: number; // false
//     numberOfClients: number; // role: client
//     numberOfProducts: number
//     productswithNoInventory: number; // 0
//     lowInventory: number; // productos con 10 o menos 
// }

// {numberOfOrders}:OrderInfo
const DashboardPage = () => {

    // console.log('Estos son los props',{numberOfOrders})
    //Vamos a utilizar SWR para poder decirle en que lapso de tiempo queremos
    // que se actualice


    const {data, error, } = useSWR<DashboardSummaryResponse>('/api/admin/dashboard', {
        refreshInterval: 30 * 1000 // 30 segundos
    });


    const [refreshIn, setRefreshIn] = useState(30);

    useEffect(() => {
      const interval = setInterval(()=>{
            console.log('Tick');
            setRefreshIn(prev => prev > 0 ? prev -1 : 30)

        }, 1000)
    
        return () => clearInterval(interval)
        
    }, [])
    


    if (!error && !data) {
        return <></>
    }


    if (error) {
        console.log({error})
        return <Typography>Error al cargar la información </Typography>
    }


    const {
        numberOfOrders,
        paidOrders,
        notPaidOrders,
        numberOfClients,
        numberOfProducts,
        productswithNoInventory,
        lowInventory
    } = data!;




  return (
    <AdminLayout    
        title='Dashboard' 
        subTitle='Estadisticas Generales' 
        icon={<DashboardOutlined/>}
    > 
        <Grid container spacing={2}>
            <SummaryTile
                title={numberOfOrders}
                subTitle='Ordenes Totales'
                icon={<CreditCardOutlined color='secondary' sx={{fontSize: 40}} />}
            />
            <SummaryTile
                title={paidOrders}
                subTitle='Ordenes Pagadas'
                icon={<AttachMoneyOutlined color='secondary' sx={{fontSize: 60}} />}
            />
            <SummaryTile
                title={notPaidOrders}
                subTitle='Ordenes Pendientes'
                icon={<CreditCardOffOutlined color='secondary' sx={{fontSize: 40}} />}
            />
            <SummaryTile
                title={numberOfClients}
                subTitle='Clientes'
                icon={<GroupOutlined color='secondary' sx={{fontSize: 40}} />}
            />
            <SummaryTile
                title={numberOfProducts}
                subTitle='Productos'
                icon={<CategoryOutlined color='secondary' sx={{fontSize: 40}} />}
            />
            <SummaryTile
                title={productswithNoInventory}
                subTitle='Sin existencias'
                icon={<CancelPresentationOutlined color='error' sx={{fontSize: 40}} />}
            />
            <SummaryTile
                title={lowInventory}
                subTitle='Bajo inventario'
                icon={<ProductionQuantityLimitsOutlined color='warning' sx={{fontSize: 40}} />}
            />
            <SummaryTile
                title={refreshIn}
                subTitle='Actualización en:'
                icon={<AccessTimeOutlined color='secondary' sx={{fontSize: 40}} />}
            />

        </Grid>
    </AdminLayout>
  )
}



// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//     console.log('Que pasa con el gssp')
//     const { data } = await axios.get('http://localhost:3000/api/admin/dashboard');  // your fetch function here 

//     if (!data) {
//         return {
//             redirect: {
//                 destination: '/',
//                 permanent: false
//             }
        
//         }
//     }


//     return {
//         props: {...data}
        
//     }
// }



export default DashboardPage;