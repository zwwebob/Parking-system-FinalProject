
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
    const token = await getToken({ req });
    const { pathname } = req.nextUrl;

    // Cho phép public routes
    if (pathname.startsWith('/login') || pathname === '/') return NextResponse.next();

    // Nếu chưa đăng nhập, chuyển hướng về login
    if (!token) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    // Nếu là admin thì có quyền truy cập mọi admin route
    if (pathname.startsWith('/admin') && token.role !== 'admin') {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    // Nếu là staff thì không được vào admin route, nhưng được vào staff route
    if (pathname.startsWith('/staff') && token.role !== 'staff') {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/staff/:path*'],
};