import { NextRequest, NextResponse } from "next/server";
import { signupSchema } from "@/lib/validations/auth.schema";
import { hashPassword } from "@/lib/auth/password";
import { setSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { z } from "zod";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = signupSchema.parse(body);

    // Check existing user
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({
        success: false,
        error: { code: "CONFLICT", message: "An account with this email already exists." }
      }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword
      }
    });

    // Create session
    const sessionPayload = { id: user.id, email: user.email, name: user.name || "" };
    await setSession(sessionPayload);

    return NextResponse.json({
      success: true,
      data: sessionPayload
    });

  } catch (error: any) {
    if (error?.errors) {
      return NextResponse.json({
        success: false,
        error: { code: "INVALID_INPUT", message: error.errors[0]?.message || "Invalid input" }
      }, { status: 400 });
    }
    
    console.error("Signup error:", error);

    return NextResponse.json({
      success: false,
      error: { code: "INTERNAL_SERVER_ERROR", message: "An unexpected error occurred." }
    }, { status: 500 });
  }
}
