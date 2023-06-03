import { GetServerSideProps } from 'next'
import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material"


import { ShopLayout } from "@/components/layouts"
import { countries, jwt } from '@/utils'
import { useForm } from 'react-hook-form'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import { CartContext } from '@/context'


type FormData = {
    firsName : string;
    lastName : string;
    address  : string;
    address2?: string;
    zip      : string;
    city     : string;
    country  : string;  
    phone    : string
}

const getAddressFromCookies = (): FormData => {

    return {
        firsName : Cookies.get('firsName') || '',
        lastName : Cookies.get('lastName') || '',
        address  : Cookies.get('address') || '',
        address2 : Cookies.get('address2') || '',
        zip      : Cookies.get('zip') || '',
        city     : Cookies.get('city') || '',
        country  : Cookies.get('country') || '',
        phone    : Cookies.get('phone') || ''
    }
}



const AddressPage = () => {

    useEffect(() => {
      console.log('useEffect del address')
    //   console.log()
    }, [])
    
    
    const router = useRouter();
    const {updateAddress} = useContext(CartContext)
    
    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
        defaultValues:{
            firsName: '',        
            lastName: '',        
            address: '',     
            address2: '',        
            zip: '',     
            city: '',        
            country: countries[0].code,     
            phone: '',       
        
        }
        
    });
    useEffect(() => {
      reset(getAddressFromCookies());
    
    }, [reset])
    

    const onSubmit=(data: FormData)=>{


        updateAddress(data);

        console.log('Pasó el middlaware para address y ahora va para summary')
        router.push('/checkout/summary');

    }

  return (

    <ShopLayout title='Dirección' pageDescription='Confirmar la dirección del destino'>
        <Typography variant="h1" component='h1'>Dirección</Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2} sx={{mt: 2}}>
                <Grid item xs={12} sm={6}>
                    <TextField 
                        label='Nombre' 
                        variant="filled" 
                        fullWidth 
                        
                    
                        {...register('firsName',{
                                    required: 'Este campo es obligatorio'
                        })}
                        error={!!errors.firsName}
                        helperText={errors.firsName?.message}
                        />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField 
                        label='Apellido' 
                        variant="filled" fullWidth 
                        {...register('lastName',{
                                    required: 'Este campo es obligatorio'
                        })}
                        error={!!errors.lastName}
                        helperText={errors.lastName?.message}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField 
                        label='Dirección' 
                        variant="filled" fullWidth 
                        {...register('address',{
                                    required: 'Este campo es obligatorio'
                        })}
                        error={!!errors.address}
                        helperText={errors.address?.message}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField 
                        label='Dirección 2' 
                        variant="filled" 
                        fullWidth 
                        {...register('address2')}
                        error={!!errors.address2}
                        helperText={errors.address2?.message}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField 
                        label='Código Postal' 
                        variant="filled" 
                        fullWidth
                        {...register('zip',{
                                    required: 'Este campo es obligatorio'
                        })}
                        error={!!errors.zip}
                        helperText={errors.zip?.message}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField 
                        label='ciudad' 
                        variant="filled" fullWidth 
                        {...register('city',{
                                    required: 'Este campo es obligatorio'
                        })}
                        error={!!errors.city}
                        helperText={errors.city?.message}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    {/* <FormControl 
                        fullWidth
                        
                    > */}
                        {/* <InputLabel>País</InputLabel> */}
                        <TextField
                            // select
                            variant="filled"
                            label='País'
                            fullWidth
                            // defaultValue={Cookies.get('country') || countries[0].code}
                            {...register('country',{
                                required: 'Este campo es obligatorio'
                            })}
                            error={!!errors.country}
                            helperText={errors.country?.message}
                            
                        />
                            {/* {
                                countries.map(country => (<MenuItem key={country.code} value={country.code}>{country.name}</MenuItem>))
                            } */}
                            {/* <MenuItem value={1}>Costa Rica</MenuItem>
                            <MenuItem value={2}>Honduras</MenuItem>
                            <MenuItem value={3}>El Salvador</MenuItem>
                            <MenuItem value={4}>México</MenuItem> */}
                        {/* </TextField> */}
                    {/* </FormControl> */}

                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField 
                        label='Teléfono' 
                        variant="filled" 
                        fullWidth
                        {...register('phone',{
                                    required: 'Este campo es obligatorio'
                        })}
                        error={!!errors.phone}
                        helperText={errors.phone?.message}
                    />
                </Grid>
            </Grid>

            <Box sx={{mt:5}} display='flex' justifyContent='center'>
                <Button 
                    color='secondary' 
                    className="circular-btn" 
                    size='large'
                    type='submit'
                >
                    Revisar Pedido.
                </Button>

            </Box>

        </form>


    </ShopLayout>

  )
}


// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

// export const getServerSideProps: GetServerSideProps = async ({req}) => {

//     const { token= '' } = req.cookies;
//     let isValidToken = false;

//     console.log('token gssp address: ',{token})

    
//     try {

//         await jwt.isValidToken(token);
//         isValidToken = true;

        
//     } catch (error) {
//         isValidToken = false;
//     }
    
//     if (!isValidToken) {
//         console.log('Estoy en el getssp de address')
//         return {
//             redirect: {
//                 destination: '/auth/login?p=/checkout/address',
//                 permanent: false
//             }
//         }
//     }

//     return {
//         props: {
            
//         }
//     }
// }






export default AddressPage