import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { SavedService } from "@/lib/services/saved.service";

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ collegeId: string }> }
) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Authentication required." }
      }, { status: 401 });
    }

    const { collegeId } = await context.params;
    
    if (!collegeId) {
      return NextResponse.json({
        success: false,
        error: { code: "INVALID_INPUT", message: "College ID is required." }
      }, { status: 400 });
    }

    await SavedService.unsaveCollege(user.id, collegeId);

    return NextResponse.json({ success: true, data: null });
  } catch (error: any) {
    // If the record doesn't exist, Prisma throws RecordNotFound P2025
    if (error?.code === 'P2025') {
      return NextResponse.json({ success: true, data: null }); // Idempotent success
    }

    console.error("DELETE /api/saved-colleges error:", error);
    return NextResponse.json({
      success: false,
      error: { code: "INTERNAL_SERVER_ERROR", message: "An unexpected error occurred." }
    }, { status: 500 });
  }
}
