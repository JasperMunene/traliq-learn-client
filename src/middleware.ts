import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
    const accessToken = req.cookies.get('access_token');

    if (!accessToken) {
        const loginUrl = new URL('/auth/login', req.url);
        loginUrl.searchParams.set('next', req.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*'],
};
