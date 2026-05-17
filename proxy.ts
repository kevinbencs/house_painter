
import type { NextRequest } from 'next/server'
import { middleware } from './lib/proxy'
 
export async function proxy(request: NextRequest) {
  return await middleware(request);
}
 
export const config = {
  matcher: ['/dashboard/:path*', '/login/:path*', '/forgotpassword/:path*', '/new2fa'],
}