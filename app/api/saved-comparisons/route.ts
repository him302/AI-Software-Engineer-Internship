import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { SavedService } from "@/lib/services/saved.service";
import { z } from "zod";

const saveComparisonSchema = z.object({
  collegeIds: z.array(z.string()).min(2, "Must compare at least 2 colleges").max(3, "Cannot compare more than 3 colleges")
    .refine(ids => new Set(ids).size === ids.length, "Duplicate colleges are not allowed")
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

    const data = await SavedService.getSavedComparisons(user.id);

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("GET /api/saved-comparisons error:", error);
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
    const { collegeIds } = saveComparisonSchema.parse(body);

    const data = await SavedService.saveComparison(user.id, collegeIds);

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    if (error?.errors) {
      return NextResponse.json({
        success: false,
        error: { code: "INVALID_INPUT", message: error.errors[0]?.message || "Invalid input" }
      }, { status: 400 });
    }

    if (error?.code === 'P2003') {
      return NextResponse.json({
        success: false,
        error: { code: "NOT_FOUND", message: "One or more colleges not found." }
      }, { status: 404 });
    }

    console.error("POST /api/saved-comparisons error:", error);
    return NextResponse.json({
      success: false,
      error: { code: "INTERNAL_SERVER_ERROR", message: "An unexpected error occurred." }
    }, { status: 500 });
  }
}
