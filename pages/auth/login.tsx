import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Box, Button, Grid, TextField, Typography, Link, Chip, Divider } from '@mui/material';
import NextLink from 'next/link';
import { GetServerSideProps } from 'next'
import { useRouter } from "next/router";
import { getProviders, getSession, signIn } from "next-auth/react";


import { tesloApi } from "@/api";
import { AuthLayout } from "@/components/layouts";
import { validations } from "@/utils";
import { ErrorOutline } from "@mui/icons-material";
import { AuthContext } from "@/context";

type FormData = {
    email: string,
    password: string,
};


const LoginPage = () => {

    const router = useRouter();
    // const { loginUser } = useContext(AuthContext)
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const [showError, setShowError] = useState(false);

    const [providers, setProviders] = useState<any>({});

    useEffect(() => {
      
        getProviders().then(prov => {
            console.log(prov)
            setProviders(prov)
        })
      
    }, [])
    


    const onLoginSubmit = async({email, password}:FormData) => {
        
        setShowError(false)

        // const isvalidLogin = await loginUser(email, password);

        // if (!isvalidLogin) {
        //     setShowError(true)
        //     setTimeout(() => setShowError(false),3000);
        //     return;
        // }


        // const destination = router.query.p?.toString() || '/'

        // router.replace(destination);

        // try {
        //     const {data} = await tesloApi.post('/user/login', {email, password})
        //     const {token, user} = data;
        //     console.log({token, user})


        // } catch (error) {
        //     console.log('Hubo un error en la validación')
        //     setShowError(true)
        //     setTimeout(() => setShowError(false),3000);
        // }

        await signIn('credentials', {email, password});

    }

  return (
    <AuthLayout title={'Ingresar'}>
        <form onSubmit={handleSubmit(onLoginSubmit)} noValidate>
            <Box sx={{width: 350, padding: '10px 20px'}}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h1" component='h1'>Iniciar Sesión</Typography>
                        <Chip
                            label='No reconocemos ese usuario / contraseña'
                            color="error"
                            icon={<ErrorOutline/>}
                            className="fadeIn"
                            sx={{display: showError? 'flex': 'none'}}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField 
                            type="email"
                            label='Correo' 
                            variant="filled" 
                            fullWidth
                            {...register('email',{
                                required: 'Este campo es requerido',
                                validate: validations.isEmail
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
                            {...register('password',{
                                required: 'Este campo es requerido',
                                minLength: {value:6, message: 'Minimo 6 caracteres'}
                            })}
                            error={!!errors.password}
                            helperText={errors.password?.message}

                        />
                    </Grid>            

                    <Grid item xs={12}>
                        <Button 
                            type="submit"
                            color="secondary" 
                            className="circular-btn" 
                            size="large" 
                            fullWidth >
                                Ingresar
                        </Button>
                    </Grid>

                    <Grid item xs={12} display='flex'  justifyContent='end'>
                        <NextLink href={router.query.p ? `/auth/register?p=${router.query.p?.toString()}` : '/auth/register'} passHref legacyBehavior> 
                            <Link underline="always" >
                                ¿No tienes cuenta? Registrate
                            </Link>
                        </NextLink>

                    </Grid>

                    <Grid item xs={12} display='flex' flexDirection='column' justifyContent='end'>
                        <Divider sx={{width: '100%', mb:2}}/> 
                        {
                            Object.values(providers).map((prov:any) => {

                                if (prov.id === 'credentials') return (<div key={'credentials'}></div>)

                                return (
                                    <Button
                                        key={prov.id}
                                        variant="outlined"
                                        fullWidth
                                        color="secondary"
                                        sx={{mb:1}}
                                        onClick={()=> signIn(prov.id)}
                                    >
                                        {prov.name}
                                    </Button>    
                                )
                            })
                        }
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

export default LoginPage;