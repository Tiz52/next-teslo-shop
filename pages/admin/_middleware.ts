import { getToken } from 'next-auth/jwt';
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';


export async function middleware( req: NextRequest | any , ev: NextFetchEvent ) {

	const session: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

	const { origin, pathname } = req.nextUrl.clone();

	if( !session ) {
		return NextResponse.redirect(`${ origin }/auth/login?p=${ pathname }`);
	}

	const validRoles = ['admin','super-user','SEO'];

	if (!validRoles.includes( session.user.role )) {
		return NextResponse.redirect(origin);
	}

	return NextResponse.next();


}
