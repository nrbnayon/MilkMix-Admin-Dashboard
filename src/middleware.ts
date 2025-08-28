// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";

// =====================================================================
// CONSTANTS
// =====================================================================

// Protected routes - these require authentication
export const PROTECTED_ROUTES = [
  "/overview",
  "/profile",
  "/settings",
  "/manage-ads",
  "/manage-users",
  "/users-subscription",
  "/notifications",
  "/support",
];

// Authentication routes - redirect to overview if already logged in
const AUTH_ROUTES = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/reset-success",
  "/verify-otp",
  "/success",
];

// Public routes - accessible to everyone
const PUBLIC_ROUTES = [
  "/about",
  "/contact",
  "/terms",
  "/privacy",
  "/help",
  "/faq",
  "/unauthorized",
];

// =====================================================================
// UTILITY FUNCTIONS
// =====================================================================

/**
 * Check if the pathname matches any of the given route patterns
 */
function matchesRoutes(pathname: string, routes: string[]): boolean {
  return routes.some((route) => {
    // Exact match
    if (pathname === route) return true;
    // Dynamic route match (e.g., /profile/settings matches /profile)
    if (pathname.startsWith(route + "/")) return true;
    return false;
  });
}

/**
 * Validate JWT token format (basic structure check)
 */
function isValidJWTFormat(token: string): boolean {
  if (!token || typeof token !== "string") return false;

  const parts = token.split(".");
  if (parts.length !== 3) return false;

  try {
    // Check if each part is valid base64
    parts.forEach((part) => {
      if (part) {
        atob(part.replace(/-/g, "+").replace(/_/g, "/"));
      }
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if JWT token is expired
 */
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch {
    return true;
  }
}

/**
 * Check if user is authenticated based on localStorage tokens
 * This function extracts tokens from request headers (set by client-side code)
 */
function isAuthenticated(request: NextRequest): boolean {
  const isDev = process.env.NODE_ENV === "development";

  if (isDev) {
    console.log("🔍 [AUTH] Checking authentication...");
  }

  try {
    // Check for Authorization header (set by client-side code)
    const authHeader = request.headers.get("authorization");
    const tokenFromHeader = authHeader?.startsWith("Bearer ")
      ? authHeader.substring(7)
      : null;

    // Check for custom headers that client-side code might set
    const tokenFromCustomHeader = request.headers.get("x-auth-token");

    // Check cookies as fallback (in case client-side sets them)
    const tokenFromCookie = request.cookies.get("auth-token")?.value;

    const token = tokenFromHeader || tokenFromCustomHeader || tokenFromCookie;

    if (isDev) {
      console.log(
        "🍪 [AUTH] Token from header:",
        tokenFromHeader ? "✅ Present" : "❌ Missing"
      );
      console.log(
        "🍪 [AUTH] Token from custom header:",
        tokenFromCustomHeader ? "✅ Present" : "❌ Missing"
      );
      console.log(
        "🍪 [AUTH] Token from cookie:",
        tokenFromCookie ? "✅ Present" : "❌ Missing"
      );
    }

    if (!token || token.trim().length === 0) {
      if (isDev) console.log("❌ [AUTH] No token found");
      return false;
    }

    // Validate JWT format
    if (!isValidJWTFormat(token)) {
      if (isDev) console.log("❌ [AUTH] Invalid token format");
      return false;
    }

    // Check if token is expired
    if (isTokenExpired(token)) {
      if (isDev) console.log("❌ [AUTH] Token is expired");
      return false;
    }

    if (isDev) console.log("✅ [AUTH] Authentication successful");
    return true;
  } catch (error) {
    console.error("💥 [AUTH] Authentication check failed:", error);
    return false;
  }
}

/**
 * Add security headers to response
 */
function addSecurityHeaders(response: NextResponse): void {
  // Prevent click jacking
  response.headers.set("X-Frame-Options", "DENY");

  // Prevent MIME type sniffing
  response.headers.set("X-Content-Type-Options", "nosniff");

  // Enable XSS protection
  response.headers.set("X-XSS-Protection", "1; mode=block");

  // Control referrer information
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Add CORS headers for API routes
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, x-auth-token"
  );

  // Only in production, add HSTS
  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload"
    );
  }
}

/**
 * Create secure redirect response
 */
function createRedirectResponse(
  request: NextRequest,
  destination: string
): NextResponse {
  const url = new URL(destination, request.url);
  const response = NextResponse.redirect(url);
  addSecurityHeaders(response);
  return response;
}

/**
 * Create secure next response
 */
function createNextResponse(): NextResponse {
  const response = NextResponse.next();
  addSecurityHeaders(response);
  return response;
}

// =====================================================================
// MAIN MIDDLEWARE FUNCTION
// =====================================================================

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;
  const isDev = process.env.NODE_ENV === "development";

  if (isDev) {
    console.log(`\n🚀 [MIDDLEWARE] ${method} ${pathname}`);
  }

  // Skip middleware for Next.js internals, static files, and API routes
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    pathname === "/favicon.ico" ||
    pathname.startsWith("/icons/") ||
    pathname.startsWith("/public/") ||
    (pathname.includes(".") &&
      !pathname.endsWith("/") &&
      (pathname.includes(".js") ||
        pathname.includes(".css") ||
        pathname.includes(".png") ||
        pathname.includes(".jpg") ||
        pathname.includes(".svg") ||
        pathname.includes(".ico") ||
        pathname.includes(".gif") ||
        pathname.includes(".json")))
  ) {
    return NextResponse.next();
  }

  try {
    // Check user authentication status
    const userIsAuthenticated = isAuthenticated(request);

    // Handle root path - PUBLIC (allow unauthenticated users)
    if (pathname === "/") {
      if (isDev) console.log(`🏠 [MIDDLEWARE] Root path accessed`);

      if (userIsAuthenticated) {
        // Redirect authenticated users to overview
        if (isDev) console.log(`🏠 [MIDDLEWARE] Authenticated user → overview`);
        return createRedirectResponse(request, "/overview");
      } else {
        // Allow unauthenticated users to see root page
        if (isDev)
          console.log(
            `🏠 [MIDDLEWARE] Unauthenticated user → root page allowed`
          );
        return createNextResponse();
      }
    }

    // 🔒 PROTECTED ROUTES - STRICT ENFORCEMENT
    if (matchesRoutes(pathname, PROTECTED_ROUTES)) {
      if (isDev) console.log(`🔒 [MIDDLEWARE] Protected route: ${pathname}`);

      if (!userIsAuthenticated) {
        if (isDev)
          console.log(`🚫 [MIDDLEWARE] Access denied → Redirecting to login`);

        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
      }

      if (isDev) console.log(`✅ [MIDDLEWARE] Access granted`);
      return createNextResponse();
    }

    // 🚪 AUTHENTICATION ROUTES
    if (matchesRoutes(pathname, AUTH_ROUTES)) {
      if (isDev) console.log(`🚪 [MIDDLEWARE] Auth route: ${pathname}`);

      if (userIsAuthenticated) {
        if (isDev)
          console.log(`↩️  [MIDDLEWARE] Already authenticated → overview`);
        return createRedirectResponse(request, "/overview");
      }

      return createNextResponse();
    }

    // 🌍 PUBLIC ROUTES
    if (matchesRoutes(pathname, PUBLIC_ROUTES)) {
      if (isDev) console.log(`🌍 [MIDDLEWARE] Public route: ${pathname}`);
      return createNextResponse();
    }

    // 🛡️ UNKNOWN ROUTES - DEFAULT TO PROTECTED FOR SECURITY
    if (isDev)
      console.log(
        `❓ [MIDDLEWARE] Unknown route: ${pathname} - treating as protected`
      );

    if (!userIsAuthenticated) {
      if (isDev) console.log(`🚫 [MIDDLEWARE] Unknown route blocked`);
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return createNextResponse();
  } catch (error) {
    console.error("💥 [MIDDLEWARE] Critical error:", error);
    return createNextResponse();
  }
}

// =====================================================================
// MIDDLEWARE CONFIG
// =====================================================================

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public|icons).*)",
  ],
};
