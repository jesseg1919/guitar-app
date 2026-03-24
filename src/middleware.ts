import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // If user is logged in and visits auth pages or landing, redirect to dashboard
    if (
      token &&
      (pathname === "/" || pathname === "/login" || pathname === "/signup")
    ) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Return true to allow the request, false to redirect to signIn page
      authorized({ token, req }) {
        const { pathname } = req.nextUrl;

        // Public routes — always allowed
        const publicRoutes = ["/", "/login", "/signup"];
        if (publicRoutes.includes(pathname)) return true;

        // API auth routes — always allowed
        if (pathname.startsWith("/api/auth")) return true;

        // Guest-accessible routes (Grade 1 lessons, chord library browsing)
        if (pathname === "/lessons") return true;
        if (pathname === "/chords") return true;
        if (pathname === "/songs") return true;
        if (pathname === "/practice") return true;
        if (pathname.startsWith("/practice/")) return true;

        // Everything else requires authentication
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public files (images, audio, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|images|audio).*)",
  ],
};
