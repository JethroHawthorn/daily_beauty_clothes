import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from '@/lib/session'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Define public routes
  const isPublicRoute = path === '/login'

  // Decrypt the session from the cookie
  const cookie = request.cookies.get('session')?.value
  const session = await decrypt(cookie)

  // Redirect to /login if the user is not authenticated and trying to access a protected route
  if (!isPublicRoute && !session?.userId) {
    return NextResponse.redirect(new URL('/login', request.nextUrl))
  }

  // Redirect to / (home) if the user is authenticated and trying to access login
  if (isPublicRoute && session?.userId) {
    return NextResponse.redirect(new URL('/', request.nextUrl))
  }

  return NextResponse.next()
}

// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sw.js|workbox-|manifest.json|.*\\.png|.*\\.svg).*)'],
}
