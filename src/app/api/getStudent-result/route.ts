import dbConnection from "@/lib/dbConnect";
import students from "@/model/students";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
      const { rollNumber } = await request.json(); // rollNumber is a string here
      if (!rollNumber) {
        return NextResponse.json({ message: 'Roll number is required' }, { status: 400 });
      }
  
      await dbConnection(); // Connect to the database
  
      const student = await students.findOne({ rollNumber });

      if (!student) {
        return NextResponse.json({ message: 'Student not found' }, { status: 404 });
      }
  
      return NextResponse.json({ student });
    } catch (error) {
      console.error('Error fetching student:', error);
      return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
  }
  