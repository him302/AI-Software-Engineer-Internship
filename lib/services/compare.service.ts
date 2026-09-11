import { prisma } from "@/lib/db/prisma";

export class CompareService {
  static async getComparisonData(ids: string[]) {
    // If IDs are passed as strings, wait! The college frontend might use IDs or slugs.
    // The requirement says GET /api/compare?ids=college1,college2,college3
    // We'll search by id (UUID) or slug to be safe.
    
    const colleges = await prisma.college.findMany({
      where: {
        OR: [
          { id: { in: ids } },
          { slug: { in: ids } }
        ]
      },
      include: {
        courses: {
          include: { course: true },
          take: 1
        }
      }
    });

    return colleges.map((c: any) => ({
      ...c,
      popularCourse: c.courses[0]?.course.name || null
    }));
  }
}
