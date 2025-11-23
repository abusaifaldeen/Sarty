
import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  const {
    data: { user },
  } = await createClient(request).auth.getUser();

  // if user is signed in and the current path is /login or /signup, redirect to /rooms
  if (user && (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/signup'))) {
    return NextResponse.redirect(new URL('/rooms', request.url));
  }

  // if user is not signed in and the current path is not a public route, redirect to /login
  const isPublicRoute = request.nextUrl.pathname === '/' ||
                        request.nextUrl.pathname.startsWith('/login') ||
                        request.nextUrl.pathname.startsWith('/signup') ||
                        request.nextUrl.pathname.startsWith('/rooms');
  if (!user && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
