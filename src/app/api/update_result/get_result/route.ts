import dbConnection from "@/lib/dbConnect";
import StudentResults from "@/model/StudentResults";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json(
      { message: "Job ID is required" },
      { status: 400 }
    );
  }

  try {
    // Connect to the database
    await dbConnection();

    const studentResult = await StudentResults.findById(id);
    if (!studentResult) {
      return NextResponse.json(
        { message: "Student result not found" },
        { status: 404 }
      );
    }

    // Return the student result in the response
    return NextResponse.json(studentResult);
  } catch (error) {
    console.error("Error fetching student result:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching the student result" },
      { status: 500 }
    );
  }
}
