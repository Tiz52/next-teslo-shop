import { GetServerSideProps, NextPage } from 'next';

import { Typography, Grid, Card, CardContent, Divider, Box, Chip } from '@mui/material';
import { AirplaneTicketOutlined, CreditCardOffOutlined } from '@mui/icons-material';

import { IOrder } from '../../../interfaces';
import { CartList, OrderSummary } from '../../../components/cart';
import { AdminLayout } from '../../../components/layouts';
import { dbOrders } from '../../../database';

interface Props {
	order: IOrder
}

const OrderPage: NextPage<Props> = ({ order }) => {

	const { isPaid, _id, subTotal, total, tax, numberOfItems, orderItems, shippingAddress } = order;


	return (
		<AdminLayout
			title={'Resumen de la orden'}
			subTitle={`OrdenId: ${ _id }`}
			icon={ <AirplaneTicketOutlined/> }
		>
			{
				isPaid 
					? 
					(
						<Chip
							sx={{ my: 2 }}
							label='Orden ya fue pagada'
							variant='outlined'
							color='success'
							icon={<CreditCardOffOutlined/>}
						/>
					)
					:
					(
						<Chip
							sx={{ my: 2 }}
							label='Pendiente de pago'
							variant='outlined'
							color='error'
							icon={<CreditCardOffOutlined/>}
						/>
					)
			}
	
			<Grid	container className='fadeIn'>
				<Grid item xs={ 12 } sm={ 7 }>
					<CartList products={ orderItems }/>					
				</Grid>
				<Grid item xs={ 12 } sm={ 5 }>
					<Card className='sumary-card' sx={{ mt: { xs:4, sm:0 } }}>
						<CardContent>

							<Typography variant='h2' >Resumen ({ numberOfItems } { numberOfItems > 1 ? 'productos' : 'producto' })</Typography>

							<Divider sx={{ my:1 }}/>

							<Box display='flex' justifyContent='space-between'>
								<Typography variant='subtitle1'>Dirección de entrega</Typography>
							</Box>

							<Typography>{ shippingAddress.firstName } { shippingAddress.lastName }</Typography>
							<Typography>{ shippingAddress.address }{ shippingAddress.address2 ? `, ${ shippingAddress.address2 }` : '' } </Typography>
							<Typography>{ shippingAddress.city }, { shippingAddress.zip }</Typography>
							<Typography>{ shippingAddress.country } </Typography>
							<Typography>{ shippingAddress.phone }</Typography>

							<Divider sx={{ my:1 }}/>
			
							<OrderSummary orderValues={{ 
								numberOfItems, 
								subTotal, 
								total, 
								tax }}/>
	
							<Box sx={{ mt:3 }} display='flex' flexDirection='column'>
								<Box sx={{ display: 'flex', flex: 1}} flexDirection='column' >

									{
										isPaid 
											? 
											(
												<Chip
													sx={{ my: 2 }}
													label='Orden ya fue pagada'
													variant='outlined'
													color='success'
													icon={<CreditCardOffOutlined/>}
												/>
											)
											:
											(
												<Chip
													sx={{ my: 2 }}
													label='Pendiente de pago'
													variant='outlined'
													color='error'
													icon={<CreditCardOffOutlined/>}
												/>
											)
									}

								</Box>

							</Box>
	
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</AdminLayout>

	);
};



export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
	
	const { id = '' } = query;

	//Se puede hacer una petición http
	const order = await dbOrders.getOrderById( id.toString() );

	if( !order ) {
		return {
			redirect: {
				destination: '/admin/orders',
				permanent: false
			}
		};
	}

	return {
		props: {
			order
		}
	};
};


export default OrderPage;