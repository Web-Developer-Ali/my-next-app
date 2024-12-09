import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify, JWTPayload } from "jose";

// This function mimics jwt.verify but works in Edge runtime
async function verifyJWT(token: string, secret: string): Promise<JWTPayload> {
  const encoder = new TextEncoder();
  const secretBuffer = encoder.encode(secret);
  
  try {
    const { payload } = await jwtVerify(token, secretBuffer);
    return payload;
  } catch {
    throw new Error('Invalid token');
  }
}

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  // Fetch token from cookies
  const token = req.cookies.get("adminToken")?.value;

  // Check if the user is trying to access the sign-in page
  if (url.pathname === "/sign-in") {
    // If token exists, verify it
    if (token) {
      try {
        const secret = process.env.JWT_SECRET!;
        await verifyJWT(token, secret);
        
        // If verification is successful, redirect to dashboard
        url.pathname = "/teacher-dashboard";
        return NextResponse.redirect(url);
      } catch {
        // If token is invalid, allow access to sign-in page
        return NextResponse.next();
      }
    }
    // If no token, allow access to sign-in page
    return NextResponse.next();
  }

  // For other protected routes
  if (!token) {
    // If token is missing, redirect to the sign-in page
    url.pathname = "/sign-in";
    return NextResponse.redirect(url);
  }

  try {
    // Validate the JWT token
    const secret = process.env.JWT_SECRET!;
    await verifyJWT(token, secret);

    // Token is valid, continue to the next middleware or route
    return NextResponse.next();
  } catch (error) {
    console.error("Invalid token:", error);

    // Redirect to the sign-in page on invalid token
    url.pathname = "/sign-in";
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ["/sign-in", "/teacher-dashboard", "/add-results"],
};