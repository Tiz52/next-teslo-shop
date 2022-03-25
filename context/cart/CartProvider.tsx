import { FC, useEffect, useReducer } from 'react';

import Cookie from 'js-cookie';

import { CartContext, cartReducer  } from '.';
import { ICartProduct, IOrder, ShippingAddress } from '../../interfaces';
import { tesloApi } from '../../api';
import axios from 'axios';


export interface CartState {
	isLoaded: boolean;
	cart: ICartProduct[];
	numberOfItems: number;
	subTotal: number;
	tax: number;
	total: number;

	shippingAddress?: ShippingAddress;
}

const CART_INITIAL_STATE: CartState = {
	isLoaded: false,
	cart: [],
	numberOfItems: 0,
	subTotal: 0,
	tax: 0,
	total: 0,

	shippingAddress: undefined
};

export const CartProvider:FC = ({ children }) => {

	const [state, dispatch] = useReducer( cartReducer , CART_INITIAL_STATE);


	useEffect( () => {
		try {
			const cookieProducts = Cookie.get('cart') ? JSON.parse(Cookie.get('cart')!) :[];
			dispatch({type:'[Cart] - LoadCart from cookies | storage', payload:cookieProducts });
		}catch(error){
			dispatch({type:'[Cart] - LoadCart from cookies | storage', payload:[] });
		}
	},[]);


	useEffect (() => {

		if(Cookie.get('firstName') !== undefined ){
			const cookieAddress = {
				firstName : Cookie.get('firstName') || '',
				lastName  : Cookie.get('lastName') || '',
				address   : Cookie.get('address') || '',
				address2  : Cookie.get('address2') || '',
				zip       : Cookie.get('zip') || '',
				city      : Cookie.get('city') || '',
				country   : Cookie.get('country') || '',
				phone     : Cookie.get('phone') || '',
			};
	
			dispatch({ type:'[Cart] - LoadAddress from Cookies', payload: cookieAddress });

		}

	},[]);


	useEffect(() => {
		Cookie.set('cart', JSON.stringify( state.cart ));
	}, [state.cart]);


	useEffect( () => {
	
		const numberOfItems = state.cart.reduce( ( prev, current ) => current.quantity + prev, 0 );
		const subTotal = state.cart.reduce( (prev, current) => (current.price * current. quantity) + prev, 0 );
		const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE);

		const orderSummary =  {
			numberOfItems,
			subTotal,
			tax: taxRate * subTotal,
			total: subTotal * ( taxRate + 1)
		};

		dispatch({ type:'[Cart] - Update order summary', payload: orderSummary });

	},[state.cart]);


	const addProductToCart = ( product: ICartProduct ) => {

		const productInCart = state.cart.some( p => p._id === product._id && p.size === product.size ); 
		let cart: ICartProduct[] = [];

		if(!productInCart) {
			cart = [...state.cart, product];
		}
		else {
			cart = state.cart.map( p => {
				if(p._id !== product._id ) return p;
				if(p.size !== product.size) return p;

				p.quantity += product.quantity;

				return p;
			});
		}

		dispatch({ type:'[Cart] - Update products in cart', payload: cart });
	 };


	 const updateCartQuantity = ( product: ICartProduct ) => {
		 dispatch({ type:'[Cart] - Change cart quantity', payload: product });
	 };
	

	 const removeCartProduct = ( product: ICartProduct ) => {
		 dispatch({ type: '[Cart] - Remove product in cart', payload: product });
	 };


	 const updateAddress = ( address: ShippingAddress ) => {
		Cookie.set('firstName',address.firstName);
		Cookie.set('lastName',address.lastName);
		Cookie.set('address',address.address);
		Cookie.set('address2',address.address2 || '');
		Cookie.set('zip',address.zip);
		Cookie.set('city',address.city);
		Cookie.set('country',address.country);
		Cookie.set('phone',address.phone);

		dispatch({ type: '[Cart] - Update ShippingAddress', payload: address });
	};


	const createOrder = async():Promise<{ hasError: boolean; message: string }> => {

		if( !state.shippingAddress ) {
			throw new Error ('No hay dirección de entrega');
		}
		
		const body: IOrder = {
			orderItems: state.cart.map( p => ({
				...p,
				size: p.size!
			})),
			shippingAddress: state.shippingAddress,
			numberOfItems: state.numberOfItems,
			subTotal: state.subTotal,
			tax: state.tax,
			total: state.total,
			isPaid: false,
		};
		
		try {
			const { data } = await tesloApi.post('/orders', body);

			dispatch({ type:'[Cart] - Order Complete' });

			return {
				hasError: false,
				message: data._id!
			};


		} catch (error) {
			if( axios.isAxiosError(error) ) {
				return {
					hasError: true,
					message: error.response?.data.message
				};
			}

			return {
				hasError: true,
				message: 'Error no controlado, hable con el admninistrador'
			};

		}

	};

	return (
		<CartContext.Provider value={{ 
	 ...state,

			//Methods
			addProductToCart,
			updateCartQuantity,
			removeCartProduct,
			updateAddress,

			//Orders
			createOrder,
	 }}>
			{ children }
		</CartContext.Provider>
	);
};