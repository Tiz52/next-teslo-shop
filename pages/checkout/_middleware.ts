import { getToken } from 'next-auth/jwt';
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';


export async function middleware( req: NextRequest | any , ev: NextFetchEvent ) {

	const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

	if( !session ) {


		const { origin, pathname } = req.nextUrl.clone();
		return NextResponse.redirect(`${ origin }/auth/login?p=${ pathname }`);

		
	}


	return NextResponse.next();


	// // return new Response('No autorizado', {
	// //     status: 401
	// // });

	// try {
	// 	return NextResponse.next();

	// } catch (error) {
        
	// 	// return Response.redirect('/auth/login');
	// 	const requestedPage = req.page.name;
	// 	return NextResponse.redirect(`/auth/login?p=${ requestedPage }`);
	// }


}
