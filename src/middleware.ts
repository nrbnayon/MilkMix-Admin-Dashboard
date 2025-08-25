@@ .. @@
 import { NextRequest, NextResponse } from "next/server";
-import { jwtVerify } from "jose";

 // Define route patterns
 const AUTH_ROUTES = [
   "/login",
-  "/register",
+  "/signup",
   "/forgot-password",
   "/reset-password",
   "/verify-otp",
+  "/reset-success",
+  "/success",
 ];
 const PROTECTED_ROUTES = ["/dashboard", "/profile", "/settings"];
 const PUBLIC_ROUTES = ["/", "/about", "/contact", "/success"];

-// JWT secret - in production, use environment variable
-const JWT_SECRET = new TextEncoder().encode(
-  process.env.JWT_SECRET ||
-    "your-super-secret-jwt-key-change-this-in-production"
-);
-
 // Rate limiting store (in production, use Redis or similar)
 const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

-interface JWTPayload {
-  userId: string;
-  email: string;
-  role?: string;
-  exp: number;
-  iat: number;
-}
-
-async function verifyToken(token: string): Promise<JWTPayload | null> {
-  try {
-    const { payload } = await jwtVerify(token, JWT_SECRET);
-    return payload as unknown as JWTPayload;
-  } catch {
-    return null;
-  }
-}
-
 function isRouteMatch(pathname: string, routes: string[]): boolean {
   return routes.some((route) => {
     if (route === pathname) return true;
@@ .. @@
   // Get token from cookies or Authorization header
   const tokenFromCookie = request.cookies.get("auth-token")?.value;
   const authHeader = request.headers.get("authorization");
   const tokenFromHeader = authHeader?.startsWith("Bearer ")
     ? authHeader.substring(7)
     : null;

   const token = tokenFromCookie || tokenFromHeader;
-  const user = token ? await verifyToken(token) : null;
+  const hasValidToken = !!token;

   // Handle authentication routes
   if (isRouteMatch(pathname, AUTH_ROUTES)) {
     // If user is already authenticated, redirect to dashboard
-    if (user) {
-      return NextResponse.redirect(new URL("/dashboard", request.url));
+    if (hasValidToken) {
+      return NextResponse.redirect(new URL("/overview", request.url));
     }
     return response;
   }

   // Handle protected routes
   if (isRouteMatch(pathname, PROTECTED_ROUTES)) {
-    if (!user) {
+    if (!hasValidToken) {
       // Store the attempted URL for redirect after login
       const redirectUrl = new URL("/login", request.url);
       redirectUrl.searchParams.set("redirect", pathname);
       return NextResponse.redirect(redirectUrl);
     }

-    // Add user info to headers for the app to use
-    response.headers.set("X-User-Id", user.userId);
-    response.headers.set("X-User-Email", user.email);
-    if (user.role) {
-      response.headers.set("X-User-Role", user.role);
-    }
-
     return response;
   }

   // Handle public routes - always allow access
   if (isRouteMatch(pathname, PUBLIC_ROUTES)) {
-    // Add user context if available (for personalized content)
-    if (user) {
-      response.headers.set("X-User-Id", user.userId);
-      response.headers.set("X-User-Email", user.email);
-      if (user.role) {
-        response.headers.set("X-User-Role", user.role);
-      }
-    }
     return response;
   }

   // Handle OTP verification route
@@ .. @@
   }

   // For all other routes not explicitly defined, require authentication
-  if (!user) {
+  if (!hasValidToken) {
     const redirectUrl = new URL("/login", request.url);
     redirectUrl.searchParams.set("redirect", pathname);
     return NextResponse.redirect(redirectUrl);
   }

-  // Add user context for authenticated users on undefined routes
-  response.headers.set("X-User-Id", user.userId);
-  response.headers.set("X-User-Email", user.email);
-  if (user.role) {
-    response.headers.set("X-User-Role", user.role);
-  }
-
   return response;
 }