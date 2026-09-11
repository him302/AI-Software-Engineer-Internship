import { NextRequest, NextResponse } from "next/server";
import { CompareService } from "@/lib/services/compare.service";
import { compareCollegesQuerySchema } from "@/lib/validations/college.schema";
import { ApiResponse } from "@/lib/api-types";
import { z } from "zod";

export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    
    // Validate Query Params
    const validatedData = compareCollegesQuerySchema.parse(searchParams);

    // Call Service
    const data = await CompareService.getComparisonData(validatedData.ids);

    if (data.length < 2) {
      return NextResponse.json({
        success: false,
        error: { code: "INVALID_COMPARISON", message: "Found fewer than 2 valid colleges for the provided IDs." }
      }, { status: 400 });
    }

    const response: ApiResponse<typeof data> = {
      success: true,
      data
    };

    return NextResponse.json(response);
  } catch (error: any) {
    if (error?.errors) {
      return NextResponse.json({
        success: false,
        error: { code: "INVALID_QUERY", message: error.errors[0]?.message || "Invalid input" }
      }, { status: 400 });
    }
    
    console.error("GET /api/compare error:", error);
    return NextResponse.json({
      success: false,
      error: { code: "INTERNAL_SERVER_ERROR", message: "An unexpected error occurred." }
    }, { status: 500 });
  }
}
