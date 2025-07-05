import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    
    // Check if user is trying to access dashboard without authentication
    if (pathname.startsWith("/dashboard")) {
      return NextResponse.next();
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Allow access to auth pages
        if (pathname.startsWith("/auth")) {
          return true;
        }
        
        // Require authentication for dashboard
        if (pathname.startsWith("/dashboard")) {
          return !!token;
        }
        
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
};
