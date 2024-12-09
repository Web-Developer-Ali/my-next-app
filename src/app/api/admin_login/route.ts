import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Admin from '@/model/admin';
import dbConnection from '@/lib/dbConnect';

// Load environment variables
const { JWT_SECRET, JWT_EXPIRATION } = process.env;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required.');
}

export async function POST(request: Request) {
  await dbConnection();
  try {
    const { username, password } = await request.json();

    // Find the admin in the database
    const admin = await Admin.findOne({ username });
   
    if (!admin) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }

    // Validate the password
    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }

    // Generate JWT
    const token = jwt.sign({ username, role: 'admin' }, JWT_SECRET as string, {
      expiresIn: JWT_EXPIRATION || '1h',
    });

    // Create a response with the token in a cookie
    const response = NextResponse.json(
      { message: 'Login successful' },
      { status: 200 }
    );

    // Set the token as an HTTP-only cookie
    response.cookies.set('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error in login API:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { username, currentPassword, newPassword } = await request.json();

    // Find the admin in the database
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return NextResponse.json({ error: 'Admin user not found' }, { status: 404 });
    }

    // Validate the current password
    const isPasswordValid = await bcrypt.compare(currentPassword, admin.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 });
    }

     // Update the password in the database
    admin.password = newPassword;
    await admin.save();

    return NextResponse.json({ message: 'Password updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error in password update API:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}