import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { promisify } from 'util';
import dbConnection from '@/lib/dbConnect';
import { uploadOnCloudinary } from '@/lib/cloudinary';
import StudentResults from '@/model/StudentResults';

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
    const name = formData.get('name') as string;
    const marks = formData.get('marks') as string;
    const image = formData.get('resultImage') as File;

    // Validate required fields
    if (!rollNumber || !name || !marks || !image) {
      return NextResponse.json(
        { error: 'Roll number, name, marks, and image are required' },
        { status: 400 }
      );
    }

    // Convert rollNumber and marks to numbers
    const rollNumberNumber = parseInt(rollNumber, 10);
    const marksNumber = parseInt(marks, 10);

    if (isNaN(rollNumberNumber) || isNaN(marksNumber)) {
      return NextResponse.json(
        { error: 'Roll number and marks must be valid numbers' },
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
    const newStudent = new StudentResults({
      rollNumber: rollNumberNumber,
      name,
      marks: marksNumber,
      resultImage: {
        imageUrl,
        publicId,
      },
    });

    await newStudent.save();

    // Return success response
    return NextResponse.json({
      message: 'Student data saved',
    });
  } catch (err) {
    console.error('Error in upload handler:', err);
    return NextResponse.json(
      { error: 'Failed to upload student data' },
      { status: 500 }
    );
  }
}
