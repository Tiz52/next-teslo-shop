import {  Grid, Typography } from '@mui/material';
import { FC, useContext } from 'react';
import { CartContext } from '../../context';
import { currency } from '../../utils';

interface Props {
	orderValues?: {
		numberOfItems: number;
		subTotal: number;
		total: number;
		tax: number;
	}
}

export const OrderSummary:FC<Props> = ({ orderValues }) => {

	const { numberOfItems, subTotal, tax, total } = useContext(CartContext);

	const orderValuesToShow = orderValues ? orderValues : { numberOfItems, subTotal, tax, total };

	return (
		<Grid container>

			<Grid item xs={ 6 }>
				<Typography>No. Productos</Typography>
			</Grid>

			<Grid item xs={ 6 } display='flex' justifyContent='end'>
				<Typography>{ orderValuesToShow.numberOfItems } { orderValuesToShow.numberOfItems > 1 ? 'items' : 'item'}</Typography>
			</Grid>

			<Grid item xs={ 6 } >
				<Typography>SubTotal</Typography>
			</Grid>


			<Grid item xs={ 6 } display='flex' justifyContent='end'>
				<Typography>{ currency.format(orderValuesToShow.subTotal) }</Typography>
			</Grid>

			<Grid item xs={ 6 }>
				<Typography>Impuestos ({Number(process.env.NEXT_PUBLIC_TAX_RATE)*100}%)</Typography>
			</Grid>

			<Grid item xs={ 6 } display='flex' justifyContent='end'>
				<Typography>{ currency.format(orderValuesToShow.tax) }</Typography>
			</Grid>

			<Grid item xs={ 6 } sx={{ mt:2 }}>
				<Typography variant='subtitle1'>Total:</Typography>
			</Grid>

			<Grid item xs={ 6 } sx={{ mt:2 }} display='flex' justifyContent='end'>
				<Typography variant='subtitle1'>{ currency.format(orderValuesToShow.total) }</Typography>
			</Grid>


		</Grid>
	);
};