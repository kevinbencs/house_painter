
import type { NextRequest, NextFetchEvent } from 'next/server'
import { middleware } from './lib/proxy'
 
export async function proxy(request: NextRequest, event: NextFetchEvent) {
  return await middleware(request, event);
}
 
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}