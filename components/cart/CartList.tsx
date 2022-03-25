import NextLink from 'next/link';
import { Box, Button, CardActionArea, CardMedia, Grid, Link, Typography } from '@mui/material';
import { ItemCounter } from '../ui';
import { FC, useContext } from 'react';
import { CartContext } from '../../context';
import { ICartProduct, IOrderItem } from '../../interfaces';

interface Props {
	editable?: boolean
	products?: IOrderItem[]
}

export const CartList: FC<Props> = ({ editable = false, products }) => {

	const { cart: productsInCart, updateCartQuantity, removeCartProduct } = useContext(CartContext);

	const onNewCartQuantityValue = (product: ICartProduct, newQuantityValue: number) => {
		product.quantity = newQuantityValue;
		updateCartQuantity( product );
	};


	const productsToShow = products ? products : productsInCart;

	return (
		<>
			{
				productsToShow.map( product => (
					<Grid container key={ product.slug + product.size } spacing={ 1 } sx={{ mb:1 }}>

						<Grid item xs={ 3 }>
							<NextLink href={`/product/${product.slug}`} passHref>
								<Link>
									<CardActionArea>
										<CardMedia
											image={ product.image }
											component='img'
											sx={{ borderRadius: '5px' }}
										/>
									</CardActionArea>
								</Link>							
							</NextLink>
						</Grid>

						<Grid item xs={ 7 }>
							<Box display='flex' flexDirection='column'>
								<Typography>{ product.title }</Typography>
								<Typography>Talla: <strong>{product.size}</strong></Typography>
								{
									editable 
										? <ItemCounter
											currentValue={ product.quantity }
											maxValue={ 10 }
											updatedQuantity={ (value) => onNewCartQuantityValue(product as ICartProduct, value) }
										/>
										: <Typography variant='h5'>{ product.quantity } {product.quantity > 1 ? 'productos':'producto'}</Typography>
								}
							</Box>
						</Grid>

						<Grid item xs={ 2 } display='flex' alignItems='center' flexDirection='column' sx={{ pr:2 }} >
							<Typography variant='subtitle1'>${product.price}</Typography>
							{
								editable && (<Button 
									variant='text' 
									color='secondary'
									onClick={ () => removeCartProduct( product as ICartProduct ) }
								>
										Remover
								</Button>)
				
							}
						</Grid>

					</Grid>
	 			))
			}
		</>
	);
};