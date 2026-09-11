import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { SavedService } from "@/lib/services/saved.service";

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Authentication required." }
      }, { status: 401 });
    }

    const { id } = await context.params;
    
    if (!id) {
      return NextResponse.json({
        success: false,
        error: { code: "INVALID_INPUT", message: "Comparison ID is required." }
      }, { status: 400 });
    }

    await SavedService.deleteComparison(user.id, id);

    return NextResponse.json({ success: true, data: null });
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED_OR_NOT_FOUND" || error?.code === 'P2025') {
      return NextResponse.json({
        success: false,
        error: { code: "NOT_FOUND", message: "Comparison not found or you don't have permission to delete it." }
      }, { status: 404 });
    }

    console.error("DELETE /api/saved-comparisons error:", error);
    return NextResponse.json({
      success: false,
      error: { code: "INTERNAL_SERVER_ERROR", message: "An unexpected error occurred." }
    }, { status: 500 });
  }
}
