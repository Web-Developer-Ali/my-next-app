import { NextResponse, NextRequest } from "next/server";
import StudentResults from "@/model/StudentResults";
import dbConnection from "@/lib/dbConnect";
import { deleteFromCloudinary } from "@/lib/cloudinary";

export const dynamic = 'force-dynamic';

export async function DELETE(req: NextRequest) {
  // Connect to the database
  await dbConnection();

  try {
    // Extract the student ID from the request query
    const { searchParams } = req.nextUrl;
    const student_resultId = searchParams.get("id");

    if (!student_resultId) {
      return NextResponse.json({ message: "Student result ID is required" }, { status: 400 });
    }

    // Find the student result by ID
    const studentResult = await StudentResults.findById(student_resultId);

    if (!studentResult) {
      return NextResponse.json({ message: "Student result not found" }, { status: 404 });
    }

    // Delete the image from Cloudinary if it exists
    if (studentResult.resultImage && studentResult.resultImage.publicId) {
      await deleteFromCloudinary(studentResult.resultImage.publicId);
    }

    // Delete the student result from the database
    await StudentResults.findByIdAndDelete(student_resultId);

    return NextResponse.json(
      { message: "Student result deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting student result:", error);
    return NextResponse.json(
      { message: "Error deleting student result", error: error },
      { status: 500 }
    );
  }
}
