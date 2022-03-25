import { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import NextLink from 'next/link';
import { signIn, getSession, getProviders } from 'next-auth/react';
import { useRouter } from 'next/router';

import { Box, Button, Chip, Divider, Grid, Link, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { AuthLayout } from '../../components/layouts';
import { validation } from '../../utils';
import { ErrorOutline } from '@mui/icons-material';

type FormData = {
  email: string,
  password: string,
};


const LoginPage = () => {

	//	const { loginUser } = useContext( AuthContext );

	const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
	const [showError, setShowError] = useState(false);

	const [providers, setProviders] = useState<any>({});

	useEffect( () => {
		getProviders().then( prov => {
			
			setProviders(prov);

		} );
	},[]);

	const router = useRouter();


	const onLoginUser = async( { email, password }: FormData ) => {

		setShowError(false);
		await signIn('credentials', { email, password });

		// const isValidLogin = await loginUser( email, password );
	
		// if( !isValidLogin ) {
		// 	setShowError(true);
		// 	setTimeout(()=> setShowError(false), 3000);
		// 	return;
		// }

		// const destination = router.query.p?.toString() || '/';
		// router.replace(destination);

	};


	return (
		<AuthLayout title={ 'Ingresar' }>
			<form onSubmit={ handleSubmit(onLoginUser) } noValidate>
				<Box sx={{ width: 350, padding:'10px 20px' }}>
					<Grid container spacing={ 2 } >

						<Grid item xs={ 12 } >
							<Typography variant='h1' component='h1'>Iniciar Sesión</Typography>
							<Chip
								label='No reconocemos ese usuario / contraseña'
								color='error'
								icon={<ErrorOutline/>}
								className='fadeIn'
								sx={{ display: showError ? 'flex' : 'none' }}
							/>
						</Grid>

					
						<Grid item xs={ 12 }>
							<TextField 
								type='email'
								label='Correo' 
								variant='filled' 
								fullWidth
								{...register('email',{
									required: 'Este campo es requerido',
									validate: validation.isEmail
								})}
								error={ !!errors.email }
								helperText={ errors.email?.message }
							/>
						</Grid>

						<Grid item xs={ 12 }>
							<TextField 
								type='password' 
								label='Contraseña'
								variant='filled' 
								fullWidth
							 {...register('password',{
								 required: 'Este campo es requerido',
								 minLength: { value: 6, message: 'Mínimo es 6 caracteres'}
							 })}
							 error={ !!errors.password }
							 helperText={ errors.password?.message }
							 />
						</Grid>

						<Grid item xs={ 12 }>
							<Button 
								type='submit'
								color='secondary' 
								className='circular-btn'
								size='large' 
						    fullWidth
							>
							Ingresar
							</Button>
						</Grid>

						<Grid item xs={ 12 } display='flex' justifyContent='end'>
							<NextLink href={ router.query.p ? `/auth/register?=${ router.query.p }` : '/auth/register' } passHref>
								<Link underline='always'>
								 ¿No tienes una cuenta?

								</Link>
							</NextLink>
						</Grid>

						<Grid item xs={ 12 } display='flex' flexDirection='column' justifyContent='end'>
							 <Divider sx={{ width: '100%', mb: 2 }} />
							 {
								 Object.values( providers ).map( (provider: any) => {

									if( provider.id === 'credentials' ) return (<div key='credentials'></div>);

									return (
										<Button
											key={ provider.id }
											variant='outlined'
											fullWidth
											color='primary'
											sx={{ mb:1 }}
											onClick={ () => signIn( provider.id ) }
										>
											{ provider.name }
										</Button>
									);
								 } )
							 }
						</Grid>

					</Grid>
				</Box>
			</form>
		</AuthLayout>
	);
};
export default LoginPage;



export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
	
	const session = await getSession({ req });
	console.log(query);
	const { p = '/' } = query;

	if ( session ) {
		return {
			redirect: {
				destination: p.toString(),
				permanent: false

			}
		};
	}

	return {
		props: {
			
		}
	};
};