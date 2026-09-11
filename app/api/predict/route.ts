import { NextRequest, NextResponse } from "next/server";
import { PredictorService } from "@/lib/services/predictor.service";
import { predictorSchema } from "@/lib/validations/predictor.schema";
import { ApiResponse } from "@/lib/api-types";
import { z } from "zod";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate Input Body
    const validatedData = predictorSchema.parse(body);

    // Call Service
    const data = await PredictorService.predict(validatedData);

    const response: ApiResponse<typeof data> = {
      success: true,
      data
    };

    return NextResponse.json(response);
  } catch (error: any) {
    if (error?.errors) {
      return NextResponse.json({
        success: false,
        error: { code: "INVALID_INPUT", message: error.errors[0]?.message || "Invalid input" }
      }, { status: 400 });
    }
    
    console.error("POST /api/predict error:", error);
    
    // FALLBACK MOCK DATA
    if (String(error).includes("PrismaClientInitializationError") || String(error).includes("Can't reach database server")) {
      return NextResponse.json({
        success: true,
        data: {
          results: [
            {
              matchLevel: "Strong Match",
              reasons: ["Your rank is well within the historical cutoff range", "Fits your budget criteria"],
              college: { id: "mock-1", slug: "iit-bombay", name: "IIT Bombay - Indian Institute of Technology", location: "Mumbai", state: "Maharashtra" }
            }
          ],
          disclaimer: "These predictions are based on mock data since the database is disconnected."
        }
      });
    }

    return NextResponse.json({
      success: false,
      error: { code: "INTERNAL_SERVER_ERROR", message: "An unexpected error occurred." }
    }, { status: 500 });
  }
}
