import dbConnection from "@/lib/dbConnect";
import students from "@/model/students";
import { NextResponse } from "next/server";

export async function GET() {
    try {
           await dbConnection(); // Connect to the database
  
      const student = await students.find();

      if (!student) {
        return NextResponse.json({ message: 'Student not found' }, { status: 404 });
      }
  
      return NextResponse.json({ student });
    } catch (error) {
      console.error('Error fetching student:', error);
      return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
  }
  