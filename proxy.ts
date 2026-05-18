
import type { NextRequest, NextFetchEvent } from 'next/server'
import { middleware } from './lib/proxy'
 
export async function proxy(request: NextRequest, event: NextFetchEvent) {
  return await middleware(request, event);
}
 
export const config = {
  matcher: ['/dashboard/:path*', '/login/:path*', '/forgotpassword/:path*', '/new2fa'],
}