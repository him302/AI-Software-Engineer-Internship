import { prisma } from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";

interface GetCollegesParams {
  search?: string;
  state?: string;
  city?: string;
  collegeType?: string;
  course?: string;
  exam?: string;
  minFees?: number;
  maxFees?: number;
  minRating?: number;
  sort: string;
  page: number;
  limit: number;
}

export class CollegeService {
  static async getColleges(params: GetCollegesParams) {
    const {
      search, state, city, collegeType, course, exam,
      minFees, maxFees, minRating, sort, page, limit
    } = params;

    const skip = (page - 1) * limit;

    // Build Where Clause dynamically
    const where: Prisma.CollegeWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
        { state: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (state) where.state = { equals: state, mode: 'insensitive' };
    if (city) where.location = { equals: city, mode: 'insensitive' };
    if (collegeType) where.collegeType = { equals: collegeType, mode: 'insensitive' };
    
    if (minFees !== undefined || maxFees !== undefined) {
      where.annualFees = {};
      if (minFees !== undefined) where.annualFees.gte = minFees;
      if (maxFees !== undefined) where.annualFees.lte = maxFees;
    }

    if (minRating !== undefined) {
      where.rating = { gte: minRating };
    }

    if (course) {
      where.courses = {
        some: {
          course: { name: { equals: course, mode: 'insensitive' } }
        }
      };
    }

    if (exam) {
      where.admissionCutoffs = {
        some: {
          exam: { name: { equals: exam, mode: 'insensitive' } }
        }
      };
    }

    // Determine ordering
    let orderBy: Prisma.CollegeOrderByWithRelationInput = { rating: 'desc' };
    switch (sort) {
      case 'fees-low-to-high': orderBy = { annualFees: 'asc' }; break;
      case 'fees-high-to-low': orderBy = { annualFees: 'desc' }; break;
      case 'average-package': orderBy = { averagePackage: 'desc' }; break;
      case 'placement-rate': orderBy = { placementRate: 'desc' }; break;
      case 'name': orderBy = { name: 'asc' }; break;
      case 'rating':
      default: orderBy = { rating: 'desc' }; break;
    }

    // Execute queries in parallel
    const [colleges, total] = await Promise.all([
      prisma.college.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          courses: {
            include: { course: true },
            take: 1
          }
        }
      }),
      prisma.college.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: colleges.map((c: any) => ({
        ...c,
        popularCourse: c.courses[0]?.course.name || null
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrevious: page > 1
      }
    };
  }

  static async getCollegeBySlug(slug: string) {
    return prisma.college.findUnique({
      where: { slug },
      include: {
        courses: {
          include: { course: true }
        },
        placements: {
          orderBy: { year: 'desc' }
        },
        reviews: {
          orderBy: { createdAt: 'desc' },
          take: 5,
          include: { user: { select: { name: true } } }
        }
      }
    });
  }

  static async getCollegeCourses(slug: string) {
    const college = await prisma.college.findUnique({
      where: { slug },
      include: {
        courses: {
          include: { course: true }
        }
      }
    });
    
    if (!college) return null;
    return college.courses;
  }

  static async getCollegePlacements(slug: string) {
    const college = await prisma.college.findUnique({
      where: { slug },
      include: {
        placements: {
          orderBy: { year: 'desc' }
        }
      }
    });
    
    if (!college) return null;
    return college.placements;
  }

  static async getCollegeReviews(slug: string) {
    const college = await prisma.college.findUnique({
      where: { slug },
      include: {
        reviews: {
          orderBy: { createdAt: 'desc' },
          include: { user: { select: { name: true } } }
        }
      }
    });
    
    if (!college) return null;
    return college.reviews;
  }
}
