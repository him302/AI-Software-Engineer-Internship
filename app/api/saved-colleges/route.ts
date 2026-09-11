import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { SavedService } from "@/lib/services/saved.service";
import { z } from "zod";

const saveSchema = z.object({
  collegeId: z.string().min(1)
});

export async function GET() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Authentication required." }
      }, { status: 401 });
    }

    const data = await SavedService.getSavedColleges(user.id);

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("GET /api/saved-colleges error:", error);
    return NextResponse.json({
      success: false,
      error: { code: "INTERNAL_SERVER_ERROR", message: "An unexpected error occurred." }
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Authentication required." }
      }, { status: 401 });
    }

    const body = await request.json();
    const { collegeId } = saveSchema.parse(body);

    const data = await SavedService.saveCollege(user.id, collegeId);

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    if (error?.errors) {
      return NextResponse.json({
        success: false,
        error: { code: "INVALID_INPUT", message: error.errors[0]?.message || "Invalid input" }
      }, { status: 400 });
    }
    
    // Check for Prisma foreign key error if college doesn't exist
    if (error?.code === 'P2003') {
      return NextResponse.json({
        success: false,
        error: { code: "NOT_FOUND", message: "College not found." }
      }, { status: 404 });
    }

    console.error("POST /api/saved-colleges error:", error);
    return NextResponse.json({
      success: false,
      error: { code: "INTERNAL_SERVER_ERROR", message: "An unexpected error occurred." }
    }, { status: 500 });
  }
}
