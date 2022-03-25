import { useContext, useState } from 'react';
import { GetServerSideProps } from 'next';
import { getSession, signIn } from 'next-auth/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

import { Box, Button, Grid, Link, TextField, Typography, Chip } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';
import { useForm } from 'react-hook-form';

import { AuthLayout } from '../../components/layouts';
import { validation } from '../../utils';
import { AuthContext } from '../../context';

type FormData = {
	name: string;
	email: string;
	password: string;
}

const RegisterPage = () => {

	const { registerUser } = useContext( AuthContext );

	const router = useRouter();

	const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

	const [showError, setShowError] = useState(false);

	const [errorMessage, setErrorMessage] = useState('');


	const onRegisterForm = async( { name, email, password }: FormData ) => {
		
		setShowError(false);

		const { hasError, message  } = await registerUser( name, email, password );
	
		if( hasError ) {
			setShowError(true);
			setErrorMessage( message! );
			setTimeout( ()=> setShowError(false), 3000);
			return;
		}

		await signIn('credentials', { email, password } );
		// const destination = router.query.p?.toString() || '/';
		// router.replace(destination);

	};



	return (
		<AuthLayout title={ 'Ingresar' }>
			<form onSubmit={ handleSubmit(onRegisterForm) } noValidate>
				<Box sx={{ width: 350, padding:'10px 20px' }}>
					<Grid container spacing={ 2 } >

						<Grid item xs={ 12 } >
							<Typography variant='h1' component='h1'>Registrar usuario</Typography>
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
								label='Nombre completo' 
								variant='filled'
							 fullWidth
							 {...register('name', {
								 required: 'Este campo es requerido',
								 minLength: { value: 2, message: 'Mínimo es 2 caracteres'}
							 })}
							 error={ !!errors.name }
							 helperText={ errors.name?.message}
							 />
						</Grid>
					
						<Grid item xs={ 12 }>
							<TextField 
								type='email'
								label='Correo' 
								variant='filled' 
								fullWidth
								{...register('email', {
									required: 'Este campo es requerido',
									validate: validation.isEmail
								})}
								error={ !!errors.email }
								helperText={ errors.email?.message}
							/>
						</Grid>

						<Grid item xs={ 12 }>
							<TextField 
								label='Contraseña' 
								type='password' 
								variant='filled' 
								fullWidth
								{...register('password', {
									required: 'Este campo es requerido',
									minLength: { value: 6, message: 'Mínimo es 6 caracteres' }
								})}
								error={ !!errors.password }
								helperText={ errors.password?.message}
							/>
						</Grid>

						<Grid item xs={ 12 }>
							<Button 
								type='submit'
								color='secondary' 
								className='circular-btn' 
								size='large' 
								fullWidth>
							Registrar
							</Button>
						</Grid>

						<Grid item xs={ 12 } display='flex' justifyContent='end'>
							<NextLink  href={ router.query.p ? `/auth/login?=${ router.query.p }` : '/auth/login' } passHref>
								<Link underline='always'>
								¿Ya tienes cuenta?
								</Link>
							</NextLink>
						</Grid>

					</Grid>
				</Box>
			</form>
		</AuthLayout>
	);
};
export default RegisterPage;


export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
	
	const session = await getSession({ req });

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