import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/lib/validations/auth.schema";
import { verifyPassword } from "@/lib/auth/password";
import { setSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email }
    });

    // We intentionally return the same generic error for both to avoid account enumeration
    if (!user || !user.passwordHash) {
      return NextResponse.json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Invalid email or password." }
      }, { status: 401 });
    }

    const isValid = await verifyPassword(password, user.passwordHash);

    if (!isValid) {
      return NextResponse.json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Invalid email or password." }
      }, { status: 401 });
    }

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
    
    console.error("Login error:", error);
    
    return NextResponse.json({
      success: false,
      error: { code: "INTERNAL_SERVER_ERROR", message: "An unexpected error occurred." }
    }, { status: 500 });
  }
}
