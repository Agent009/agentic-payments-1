import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

import { prisma } from "@lib/prisma";

// Defined POST handler function for user registration
export async function POST(request: Request) {
  try {
    // Parse request body as JSON
    const body = await request.json();
    // Destructured body parameters
    const { email, name, password } = body;

    // If any required information is missing, return missing info response
    if (!email || !name || !password) {
      return new NextResponse("Missing info", { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user in the database
    const user = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword,
      },
    });

    // Return JSON response with newly created user
    return NextResponse.json(user);
  } catch (error) {
    // Log error and return internal server error response
    console.error(error, "api -> register -> POST -> REGISTRATION_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
