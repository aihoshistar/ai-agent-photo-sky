// filepath: middleware.ts
import { NextResponse } from 'next/server';

export function middleware(request: Request) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/api')) {
    return NextResponse.rewrite(request.url);
  }

  return NextResponse.next();
}