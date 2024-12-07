import dbConnection from "@/lib/dbConnect";
import StudentResults from "@/model/StudentResults";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { rollNumber, name } = await request.json();

        // Validate input
        if (!rollNumber || !name) {
            return NextResponse.json({ message: 'Both roll number and name are required' }, { status: 400 });
        }

        await dbConnection(); 

       
        const student = await StudentResults.findOne({
            rollNumber: rollNumber.trim(), 
            name: name.trim(),
        });

        if (!student) {
            return NextResponse.json({ message: 'No student found with matching roll number and name' }, { status: 404 });
        }

        return NextResponse.json({ student });
    } catch (error) {
        console.error('Error fetching student:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
