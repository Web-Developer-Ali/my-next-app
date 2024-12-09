import { NextResponse } from "next/server";

export async function GET() {
  // Clear the token from the cookie
  const res = NextResponse.json({ message: "Logged out successfully" });

  
  res.cookies.set("adminToken", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });

  return res;
}
