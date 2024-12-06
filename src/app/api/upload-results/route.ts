import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { promisify } from 'util';
import dbConnection from '@/lib/dbConnect';
import { uploadOnCloudinary } from '@/lib/cloudinary';
import students from '@/model/students';

// Promisify unlink function for async use
const unlinkAsync = promisify(fs.unlink);

// Define temporary directory path for image uploads
const tempDir = path.join(os.tmpdir(), 'students-images');

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

export async function POST(req: NextRequest) {
  try {
    // Establish a database connection
    await dbConnection();

    // Parse form data from the request
    const formData = await req.formData();
    const rollNumber = formData.get('rollNumber') as string;
    const image = formData.get('resultImage') as File;

    if (!rollNumber || !image) {
      return NextResponse.json(
        { error: 'Roll number and image are required' },
        { status: 400 }
      );
    }

    // Save the uploaded image temporarily
    const tempFilePath = path.join(tempDir, image.name);
    const buffer = Buffer.from(await image.arrayBuffer());

    fs.writeFileSync(tempFilePath, buffer);

    // Upload the file to Cloudinary
    const cloudinaryResult = await uploadOnCloudinary(tempFilePath, 'students');
    const imageUrl = cloudinaryResult.secure_url;
    const publicId = cloudinaryResult.public_id;

    // Remove the temporary file
    await unlinkAsync(tempFilePath);

    // Save student record to MongoDB
    const newStudent = new students({
      rollNumber,
      imageUrl,
      publicId,
    });

    await newStudent.save();

    // Return success response
    return NextResponse.json({
      message: 'Student data saved',
      student: {
        rollNumber: newStudent.rollNumber,
        imageUrl: newStudent.imageUrl,
      },
    });
  } catch (err) {
    console.error('Error in upload handler:', err);
    return NextResponse.json(
      { error: 'Failed to upload student data' },
      { status: 500 }
    );
  }
}
