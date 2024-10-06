import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

// Define the protected routes
export async function middleware(req: NextRequest) {
    console.log('Middleware is being executed');
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });


    const { pathname } = req.nextUrl;

    // Allow the request if it's for the sign-in page or an API route
    if (pathname === '/auth/signin' || pathname.startsWith('/api/')) {
        return NextResponse.next();
    }

    // Redirect to the sign-in page if the user is not authenticated
    if (!token) {
        return NextResponse.redirect(new URL('/auth/signin', req.url));
    }

    // Allow the request if authenticated
    return NextResponse.next();
}

// Apply middleware to the following routes
export const config = {
    matcher: ['/dashboard/:path*', '/accounts/:path*', '/another-protected-path/:path*'],
};
