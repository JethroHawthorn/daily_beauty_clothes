import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function proxy(request: NextRequest) {
  return NextResponse.next()
}

// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sw.js|workbox-|manifest.json|manifest.webmanifest|.*\\.png|.*\\.svg).*)'],
}
