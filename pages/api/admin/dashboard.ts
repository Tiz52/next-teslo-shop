import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../database';
import { Order, Product, User } from '../../../models';

type Data =
| {	message: string }
| { numberOfOrders: number;
		paidOrders: number;
		notPaidOrders: number;
		numberOfClients: number;
		numberOfProducts: number;
		productsWithNoInventary: number;
		lowInventary: number;
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

	switch (req.method) {
	case 'GET':
		return getAdminData(req, res);
	
	default:
		return res.status(400).json({ message: 'Bad Request' });
	}

}

const getAdminData = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
	
	await db.connect();

	const [numberOfOrders, 
		paidOrders, 
		numberOfClients, 
		numberOfProducts, 
		productsWithNoInventary, 
		lowInventary  ] = await Promise.all([
		Order.count(),
		Order.find({ isPaid: true }).count(),
		User.find({ role: 'client' }).count(),
		Product.count(),
		Product.find({ inStock: 0 }).count(),
		Product.find({ inStock: { $lte: 10 } }).count()
	]);

	const notPaidOrders = numberOfOrders - paidOrders;

	await db.disconnect();
	
	return res.status(200).json({
		numberOfOrders,
		paidOrders,
		notPaidOrders,
		numberOfClients,
		numberOfProducts,
		productsWithNoInventary,
		lowInventary
	});

};
