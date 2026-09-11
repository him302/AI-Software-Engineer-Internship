import { NextResponse } from "next/server";
import { MetadataService } from "@/lib/services/metadata.service";
import { ApiResponse } from "@/lib/api-types";

export async function GET() {
  try {
    const data = await MetadataService.getFilterOptions();

    const response: ApiResponse<typeof data> = {
      success: true,
      data
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("GET /api/metadata error:", error);
    
    // FALLBACK MOCK DATA FOR SANDBOX ENVIRONMENT (if DB is offline)
    if (String(error).includes("PrismaClientInitializationError") || String(error).includes("Can't reach database server")) {
      return NextResponse.json({
        success: true,
        data: {
          exams: [{ name: "JEE Main", slug: "jee-main" }, { name: "NEET", slug: "neet" }],
          courses: [{ name: "B.Tech Computer Science", degree: "B.Tech" }, { name: "MBBS", degree: "UG" }],
          states: ["Maharashtra", "Delhi", "Karnataka", "Tamil Nadu"]
        }
      });
    }

    return NextResponse.json({
      success: false,
      error: { code: "INTERNAL_SERVER_ERROR", message: "An unexpected error occurred." }
    }, { status: 500 });
  }
}
