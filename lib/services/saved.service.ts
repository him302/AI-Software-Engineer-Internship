import { prisma } from "@/lib/db/prisma";

export class SavedService {
  static async getSavedColleges(userId: string) {
    return prisma.savedCollege.findMany({
      where: { userId },
      include: {
        college: {
          select: {
            id: true,
            slug: true,
            name: true,
            location: true,
            state: true,
            collegeType: true,
            rating: true,
            annualFees: true,
            averagePackage: true,
            placementRate: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async saveCollege(userId: string, collegeId: string) {
    // Unique constraint handles duplicates, but we'll use upsert for idempotency
    return prisma.savedCollege.upsert({
      where: {
        userId_collegeId: {
          userId,
          collegeId
        }
      },
      update: {},
      create: {
        userId,
        collegeId
      }
    });
  }

  static async unsaveCollege(userId: string, collegeId: string) {
    // Delete only if it belongs to the user
    return prisma.savedCollege.delete({
      where: {
        userId_collegeId: {
          userId,
          collegeId
        }
      }
    });
  }

  static async getSavedComparisons(userId: string) {
    return prisma.savedComparison.findMany({
      where: { userId },
      include: {
        colleges: {
          include: {
            college: {
              select: {
                id: true,
                slug: true,
                name: true,
                location: true,
                rating: true,
                annualFees: true
              }
            }
          },
          orderBy: { orderIndex: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async saveComparison(userId: string, collegeIds: string[]) {
    return prisma.$transaction(async (tx) => {
      const comparison = await tx.savedComparison.create({
        data: {
          userId
        }
      });

      await tx.savedComparisonCollege.createMany({
        data: collegeIds.map((collegeId, index) => ({
          comparisonId: comparison.id,
          collegeId,
          orderIndex: index
        }))
      });

      return comparison;
    });
  }

  static async deleteComparison(userId: string, comparisonId: string) {
    // Ensure the user owns it before deleting
    const comparison = await prisma.savedComparison.findUnique({
      where: { id: comparisonId }
    });

    if (!comparison || comparison.userId !== userId) {
      throw new Error("UNAUTHORIZED_OR_NOT_FOUND");
    }

    return prisma.savedComparison.delete({
      where: { id: comparisonId }
    });
  }
}
