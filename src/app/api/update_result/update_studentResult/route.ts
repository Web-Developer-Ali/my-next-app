import { NextResponse, NextRequest } from "next/server";
import StudentResults from "@/model/StudentResults";
import dbConnection from "@/lib/dbConnect";
import { uploadOnCloudinary, deleteFromCloudinary } from "@/lib/cloudinary";
import { promisify } from "util";
import fs from "fs";
import path from "path";
import os from "os";

const unlinkAsync = promisify(fs.unlink);

// Define temporary directory path for image uploads
const tempDir = path.join(os.tmpdir(), "student-results");

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

interface UploadedFile {
  public_id: string;
  secure_url: string;
}

interface UpdateData {
  [key: string]: string | string[] | UploadedFile | boolean | { imageUrl: string; publicId: string };
}

export async function PUT(req: NextRequest) {
  // Connect to the database
  await dbConnection();

  try {
    // Get formData from the request
    const formData = await req.formData();
    if (!formData) {
      return NextResponse.json({ message: "No data found" }, { status: 400 });
    }

    // Extract student ID from form data
    const studentId = formData.get("id");

    if (!studentId) {
      return NextResponse.json({ message: "Student ID is missing from form data" }, { status: 400 });
    }

    // Extract fields from formData
    const updateData: UpdateData = {};
    let uploadedFile: { public_id: string; secure_url: string } | null = null;
    let oldImagePublicId: string | null = null;

    // Convert formData to an array and iterate over it
    const formDataEntries = Array.from(formData.entries());

    for (const [key, value] of formDataEntries) {
      if (value instanceof File) {
        // Handle file upload
        const tempFilePath = path.join(tempDir, value.name);
        const buffer = Buffer.from(await value.arrayBuffer());

        // Write file to the temporary path
        fs.writeFileSync(tempFilePath, buffer);

        // Upload the new image to Cloudinary
        const cloudinaryResult = await uploadOnCloudinary(tempFilePath, "students");

        // Store uploaded file details
        uploadedFile = {
          public_id: cloudinaryResult.public_id,
          secure_url: cloudinaryResult.secure_url,
        };

        // Clean up the temporary file
        await unlinkAsync(tempFilePath);
      } else {
        // Handle other fields like rollNumber, name, marks, etc.
        updateData[key] = value;
      }
    }

    // Find the existing student result to get the old image public ID (if any)
    const existingStudentResult = await StudentResults.findById(studentId);
    if (!existingStudentResult) {
      return NextResponse.json({ message: "Student result not found" }, { status: 404 });
    }

    // If there's a new image, delete the old one from Cloudinary (if it exists)
    if (uploadedFile) {
      oldImagePublicId = existingStudentResult.resultImage.publicId; // Assuming this field is stored in the database

      if (oldImagePublicId) {
        await deleteFromCloudinary(oldImagePublicId);
      }

      updateData.resultImage = {
        imageUrl: uploadedFile.secure_url, // Ensure this matches your schema's field name
        publicId: uploadedFile.public_id,  // Ensure this matches your schema's field name
      };
    }

    // Update the student result in the database
    const updatedStudentResult = await StudentResults.findByIdAndUpdate(studentId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedStudentResult) {
      return NextResponse.json({ message: "Failed to update student result" }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Student result updated successfully", studentResult: updatedStudentResult },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating student result:", error);
    return NextResponse.json(
      { message: "Error updating student result", error: error },
      { status: 500 }
    );
  }
}
