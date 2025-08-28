// middleware.config.ts
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - files with extensions
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public|.*\\.).*)",
  ],
};
