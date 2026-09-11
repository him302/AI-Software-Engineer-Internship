import { prisma } from "@/lib/db/prisma";

export class MetadataService {
  static async getFilterOptions() {
    const [exams, courses, states] = await Promise.all([
      prisma.exam.findMany({ select: { name: true, slug: true } }),
      prisma.course.findMany({ select: { name: true, degree: true } }),
      prisma.college.findMany({
        select: { state: true },
        distinct: ['state']
      })
    ]);

    return {
      exams,
      courses,
      states: states.map((s: any) => s.state).filter(Boolean).sort()
    };
  }
}
