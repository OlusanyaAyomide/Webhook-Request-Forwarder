import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/',
])

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/authorization(.*)',
  '/projects(.*)',
  '/settings(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth()

  // If user is logged in and tries to access public routes, redirect to dashboard
  if (userId && isPublicRoute(req)) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // Only protect routes that are explicitly protected
  if (isProtectedRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // This matcher ensures middleware runs on all routes except static files and Next.js internals
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};