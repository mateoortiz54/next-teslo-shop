import { useContext, useState } from "react";
import { useForm } from 'react-hook-form';
import NextLink from 'next/link';
import { getSession, signIn } from "next-auth/react";

import { useRouter } from "next/router";
import { GetServerSideProps } from 'next'
import { ErrorOutline } from "@mui/icons-material";
import { Box, Button, Grid, TextField, Typography, Link, Chip, Divider } from '@mui/material';

import { tesloApi } from "@/api";
import { AuthLayout } from "@/components/layouts";
import { validations } from "@/utils";
import { AuthContext } from "@/context";


type FormData = {
    name: string;
    email: string;
    password: string;
};





const RegisterPage = () => {

    const router = useRouter();
    const {registerUser} = useContext(AuthContext);

    const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>();
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const onRegisterForm = async({email, name, password}: FormData) => {
        setShowError(false);

        const {hasError, message} = await registerUser(name, email,password );

        if (hasError) {
            setShowError(true);
            setErrorMessage(message!)
            setTimeout(()=> setShowError(false),3000);
            return;
        }
        // Version antes del NextAuth
        // const destination = router.query.p?.toString() || '/'
        // router.replace(destination);


        await signIn('credentials', {email, password})


        // try {
        //     const {data} = await tesloApi.post('/user/register', {email, name, password})
        //     console.log({data}) 
        // } catch (error) {
        //     console.log('Hubo un error con el api')
        //     setShowError(true);
        //     setTimeout(()=> setShowError(false),3000)
        // }
        
    }

  return (
    <AuthLayout title={'Ingresar'}>
        <form onSubmit={handleSubmit(onRegisterForm)} noValidate>
            <Box sx={{width: 350, padding: '10px 20px'}}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h1" component='h1'>Crear Cuenta</Typography>
                        <Chip
                            label='Hubo un problema con los datos'
                            color="error"
                            icon={<ErrorOutline/>}
                            className="fadeIn"
                            sx={{display: showError? 'flex': 'none'}}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField 
                            label='Nombre' 
                            variant="filled" 
                            fullWidth
                            {...register('name', {
                                required: 'Este campo es obligatorio',
                                minLength: {value:2, message: 'debe de ser minimo de 2 caracteres'}

                            })}
                            error={!!errors.name}
                            helperText={errors.name?.message}
                        />

                    </Grid> 
                    <Grid item xs={12}>
                        <TextField 
                            type="email"
                            label='Correo'  
                            variant="filled" 
                            fullWidth
                            {...register('email', {
                                required: 'Este campo es obligatorio',
                                validate: validations.isEmail,
                            })}
                            error={!!errors.email}
                            helperText={errors.email?.message}
                        />
                    </Grid>            
                    <Grid item xs={12}>
                        <TextField 
                            label='Contraseña' 
                            type='password'     
                            variant="filled" 
                            fullWidth
                            {...register('password', {
                                required: 'Este campo es obligatorio',
                                minLength: {value:6, message: 'debe de ser minimo de 6 caracteres'}

                            })}
                            error={!!errors.password}
                            helperText={errors.password?.message}
                        />
                    </Grid>            

                    <Grid item xs={12}>
                        <Button type="submit" color="secondary" className="circular-btn" size="large" fullWidth >
                                Crear Cuenta
                        </Button>
                    </Grid>

                    <Grid item xs={12} display='flex' justifyContent='end'>
                        <NextLink href={router.query.p ? `/auth/login?p=${router.query.p?.toString()}` : '/auth/login'} passHref legacyBehavior> 
                            <Link underline="always">
                                ¿Ya tienes cuenta?
                            </Link>
                        </NextLink>

                    </Grid>

                    


                </Grid>
            </Box>
        </form>
    </AuthLayout>
  )
}



// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({req, query}) => {
    const session = await getSession({req});

    const {p ='/'} = query;


    if (session) {
        return {
            redirect: {
                destination: p.toString(),
                permanent: false

            }
            
        }
    }

    return {
        props: {}
    }
}

export default RegisterPage;