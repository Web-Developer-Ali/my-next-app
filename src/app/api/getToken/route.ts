import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Get the cookies from the request
  const cookies = request.headers.get('cookie');
  const token = cookies?.split(';').find(cookie => cookie.trim().startsWith('adminToken='));

  if (token) {
    return NextResponse.json({ token: token.split('=')[1] }); // Return the token value
  } else {
    return NextResponse.json({ token: null }); // No token found
  }
}
