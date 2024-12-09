import bcrypt from "bcrypt";
import Admin from "@/model/admin"; // Correct path to your Admin model
import dbConnection from "@/lib/dbConnect"; // Ensure this file handles MongoDB connection

export async function POST(req: Request) {
  await dbConnection(); // Ensure the database connection is established before processing

  try {
    const { username, password } = await req.json();
    // Validate request body
    if (!username || !password) {
      return new Response(
        JSON.stringify({ message: "Username and password are required" }),
        {
          status: 400,
        }
      );
    }

    // Check if the admin already exists
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return new Response(
        JSON.stringify({ message: "Admin with this username already exists" }),
        {
          status: 400,
        }
      );
    }

    // Create the new admin
    const newAdmin = new Admin({
      username,
      password,
    });

    await newAdmin.save();

    return new Response(
      JSON.stringify({ message: "Admin created successfully" }),
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error adding admin:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
    });
  }
}
