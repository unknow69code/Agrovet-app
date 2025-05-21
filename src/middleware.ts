import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

type TokenWithRole = {
  user?: {
    role?: string;
    [key: string]: any;
  };
  [key: string]: any;
};

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET }) as TokenWithRole | null;
  console.log('Token:', token); // Verifica el token en la consola
  const pathname = req.nextUrl.pathname;

  if (pathname === '/login' || pathname === '/unauthorized') {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  const userRole = token?.user?.role as string | undefined;

  // Rutas protegidas para administradores
  if (pathname.startsWith('/admin') || pathname === '/createAdmin' || pathname === '/registrer') {
    if (userRole !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
  }
  // Rutas accesibles para administradores y usuarios
  if (pathname === '/dashboard' || pathname === '/' || pathname === '/products' || pathname === '/carritoCompras' || pathname === '/clientes' || pathname === '/stock') {
    return NextResponse.next();
  }
    // Rutas accesibles solo para usuarios
  /*if ((pathname === '/createProduct' || pathname === '/createClient') && userRole !== 'user' && userRole !== 'admin') {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }*/

  // Si la ruta no coincide con ninguna de las reglas específicas, permitir el acceso (esto puede ajustarse según tus necesidades)
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",
    "/",
    "/createClient",
    "/createProduct",
    "/products",
    "/trabajadores",
    "/registrer",
    "/createAdmin",
    "/stock",
    "/clientes",
    "/admin",
    "/carritoCompras",
    "/components/:path*",
  ],
};