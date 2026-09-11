import { prisma } from "@/lib/db/prisma";
import { PredictorInput } from "../validations/predictor.schema";

// Configurable thresholds for predictions
const PREDICTOR_CONFIG = {
  STRONG_MATCH_MARGIN: 0.9, // Well within cutoff (e.g. rank 450 for a 500 cutoff)
  POSSIBLE_MATCH_MARGIN: 1.1, // Borderline (e.g. rank 550 for a 500 cutoff)
};

export class PredictorService {
  static async predict(input: PredictorInput) {
    const { exam, rank, category, course, budget, preferredState } = input;

    // Build the query to find relevant cutoffs
    const cutoffs = await prisma.admissionCutoff.findMany({
      where: {
        exam: { name: { equals: exam, mode: 'insensitive' } },
        category: { equals: category, mode: 'insensitive' },
        ...(course ? { course: { name: { equals: course, mode: 'insensitive' } } } : {})
      },
      include: {
        college: true,
        course: true
      },
      orderBy: {
        year: 'desc'
      }
    });

    if (cutoffs.length === 0) {
      return {
        results: [],
        message: "No sufficient historical cutoff data is available for this combination."
      };
    }

    const uniqueColleges = new Map();

    for (const cutoff of cutoffs) {
      if (uniqueColleges.has(cutoff.collegeId)) continue;
      
      const college = cutoff.college;
      
      let matchLevel: "Strong Match" | "Possible" | "Ambitious" = "Ambitious";
      const reasons: string[] = [];

      // Lower rank is better
      if (rank <= cutoff.closingRank * PREDICTOR_CONFIG.STRONG_MATCH_MARGIN) {
        matchLevel = "Strong Match";
        reasons.push(`Your rank (${rank}) comfortably meets recent historical cutoffs (approx ${cutoff.closingRank}).`);
      } else if (rank <= cutoff.closingRank * PREDICTOR_CONFIG.POSSIBLE_MATCH_MARGIN) {
        matchLevel = "Possible";
        reasons.push(`Your rank is close to historical boundaries (approx ${cutoff.closingRank}). Admission is possible but borderline.`);
      } else {
        matchLevel = "Ambitious";
        reasons.push(`Historically, this course required a better rank (approx ${cutoff.closingRank}). Treat this as an aspirational option.`);
      }

      if (course) {
        reasons.push(`Your preferred course (${cutoff.course.name}) is offered here.`);
      }

      if (budget) {
        if (college.annualFees <= budget) {
          reasons.push(`Annual fees (${college.annualFees}) fit comfortably within your budget.`);
        } else {
          reasons.push(`Annual fees (${college.annualFees}) exceed your stated budget.`);
          if (matchLevel === "Strong Match") matchLevel = "Possible"; 
        }
      }

      if (preferredState) {
        if (college.state.toLowerCase() === preferredState.toLowerCase()) {
          reasons.push(`Matches your preferred state (${college.state}).`);
        }
      }

      uniqueColleges.set(college.id, {
        college,
        matchLevel,
        reasons
      });
    }

    const results = Array.from(uniqueColleges.values());
    
    const scoreMap = { "Strong Match": 3, "Possible": 2, "Ambitious": 1 } as const;
    results.sort((a, b) => scoreMap[b.matchLevel as keyof typeof scoreMap] - scoreMap[a.matchLevel as keyof typeof scoreMap]);

    return {
      results,
      disclaimer: "This predictor is based on historical sample data and is intended only for informational decision support. It does not guarantee admission."
    };
  }
}
