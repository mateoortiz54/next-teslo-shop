import React, { useEffect, useState } from 'react'
import { DataGrid, GridColDef, GridRenderCellParams, GridValueGetterParams } from "@mui/x-data-grid"


import { AdminLayout } from '@/components/layouts';
import { PeopleOutline } from '@mui/icons-material';
import { Grid, MenuItem, Select } from '@mui/material';
import useSWR from 'swr';
import { IUser } from '@/interfaces';
import { tesloApi } from '@/api';

const UsersPage = () => {

    const {data, error} = useSWR<IUser[]>('/api/admin/users') // Por defecto tira el get

    const [users, setUsers] = useState<IUser[]>([]);


    
    useEffect(() => {
        if (data) {
            setUsers(data)
        }
        
        
    }, [data])
    
    if(!data && !error) return (<></>);


    const onUpdateRole = async(id:string, role:string)=>{
        
        const previosUsers  = users.map(user =>({...user}))

        const onRoleUpdate = users.map(user => ({
            ...user,
            role: user._id === id ? role : user.role

        }))

        setUsers(onRoleUpdate);

        try {
            
            const {data} = await tesloApi.put('/admin/users', {userId: id, role})

        } catch (error) {
            console.log(error)
            setUsers(previosUsers);

            alert('Hubo un error asignando el rol')
        }


    }


    const columns: GridColDef[] = [
        {field: 'email', headerName: 'Correo', width: 250},
        {field: 'name', headerName: 'Nombre Completo', width: 300},
        {
            field: 'role', 
            headerName: 'Rol', 
            width: 300,
            renderCell: ({row}:GridRenderCellParams ) => {
                return (
                    <Select
                        value={row.role}
                        label='Rol'
                        onChange={(event) => onUpdateRole(row.id, event.target.value)}
                        sx={{width: '300px'}}
                    >
                        <MenuItem value='admin'>Admin</MenuItem>
                        <MenuItem value='client'>client</MenuItem>
                        <MenuItem value='super-user'>super-user</MenuItem>
                        <MenuItem value='SEO'>SEO</MenuItem>


                    </Select>    
                )
                
                
            },
        }
    ]


    const rows = users!.map(({email, name, _id, role})=>({
        id: _id,
        email,
        name,
        role
    }))



  return (
    
    <AdminLayout 
        title={'Usuarios'} 
        subTitle={'Mantenimiento de Usuarios'} 
        icon={<PeopleOutline/>}

    >
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
    </AdminLayout>



  )
}

export default UsersPage;