import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed process...');

  // Clean up existing data to allow re-running the seed safely
  await prisma.savedComparisonCollege.deleteMany({});
  await prisma.savedComparison.deleteMany({});
  await prisma.savedCollege.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.admissionCutoff.deleteMany({});
  await prisma.collegeCourse.deleteMany({});
  await prisma.placement.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.exam.deleteMany({});
  await prisma.college.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Database cleared.');

  // Create Exams
  const jeeMain = await prisma.exam.create({
    data: { name: 'JEE Main', slug: 'jee-main', description: 'Joint Entrance Examination - Main' }
  });
  const jeeAdv = await prisma.exam.create({
    data: { name: 'JEE Advanced', slug: 'jee-advanced', description: 'Joint Entrance Examination - Advanced' }
  });
  const bitsat = await prisma.exam.create({
    data: { name: 'BITSAT', slug: 'bitsat', description: 'BITS Admission Test' }
  });

  // Create Courses
  const cse = await prisma.course.create({
    data: { name: 'Computer Science and Engineering', degree: 'B.Tech', duration: 4 }
  });
  const ece = await prisma.course.create({
    data: { name: 'Electronics and Communication Engineering', degree: 'B.Tech', duration: 4 }
  });
  const me = await prisma.course.create({
    data: { name: 'Mechanical Engineering', degree: 'B.Tech', duration: 4 }
  });

  // Create Colleges
  const iitm = await prisma.college.create({
    data: {
      name: 'Indian Institute of Technology, Madras',
      slug: 'iit-madras',
      location: 'Chennai',
      state: 'Tamil Nadu',
      collegeType: 'Public',
      rating: 4.8,
      annualFees: 215000,
      averagePackage: 1850000,
      highestPackage: 19800000,
      placementRate: 94.5,
      establishedYear: 1959,
      website: 'https://www.iitm.ac.in',
      description: 'IIT Madras is one of the premier engineering institutes in India.'
    }
  });

  const bits = await prisma.college.create({
    data: {
      name: 'Birla Institute of Technology and Science',
      slug: 'bits-pilani',
      location: 'Pilani',
      state: 'Rajasthan',
      collegeType: 'Private',
      rating: 4.6,
      annualFees: 540000,
      averagePackage: 1600000,
      highestPackage: 6000000,
      placementRate: 92.0,
      establishedYear: 1964,
      description: 'BITS Pilani is a premier private institute of higher education.'
    }
  });

  const nitT = await prisma.college.create({
    data: {
      name: 'National Institute of Technology, Trichy',
      slug: 'nit-trichy',
      location: 'Tiruchirappalli',
      state: 'Tamil Nadu',
      collegeType: 'Public',
      rating: 4.5,
      annualFees: 165000,
      averagePackage: 1250000,
      highestPackage: 4200000,
      placementRate: 90.0,
      establishedYear: 1964,
    }
  });

  // Link Courses to Colleges (CollegeCourse)
  await prisma.collegeCourse.createMany({
    data: [
      { collegeId: iitm.id, courseId: cse.id, seats: 60, fees: 215000 },
      { collegeId: iitm.id, courseId: ece.id, seats: 60, fees: 215000 },
      { collegeId: bits.id, courseId: cse.id, seats: 120, fees: 540000 },
      { collegeId: bits.id, courseId: me.id, seats: 80, fees: 540000 },
      { collegeId: nitT.id, courseId: ece.id, seats: 90, fees: 165000 },
      { collegeId: nitT.id, courseId: cse.id, seats: 90, fees: 165000 },
    ]
  });

  // Placements
  await prisma.placement.createMany({
    data: [
      { collegeId: iitm.id, year: 2023, averagePackage: 1850000, highestPackage: 19800000, placementRate: 94.5 },
      { collegeId: iitm.id, year: 2022, averagePackage: 1700000, highestPackage: 15000000, placementRate: 92.0 },
      { collegeId: bits.id, year: 2023, averagePackage: 1600000, highestPackage: 6000000, placementRate: 92.0 },
      { collegeId: nitT.id, year: 2023, averagePackage: 1250000, highestPackage: 4200000, placementRate: 90.0 },
    ]
  });

  // Admission Cutoffs (Simulated Closing Ranks for Predictor)
  await prisma.admissionCutoff.createMany({
    data: [
      // IITM CSE requires JEE Adv
      { collegeId: iitm.id, courseId: cse.id, examId: jeeAdv.id, category: 'General', year: 2023, openingRank: 10, closingRank: 144 },
      // NIT Trichy CSE requires JEE Main
      { collegeId: nitT.id, courseId: cse.id, examId: jeeMain.id, category: 'General', year: 2023, closingRank: 1500 },
      { collegeId: nitT.id, courseId: ece.id, examId: jeeMain.id, category: 'General', year: 2023, closingRank: 4500 },
      // BITS requires BITSAT
      { collegeId: bits.id, courseId: cse.id, examId: bitsat.id, category: 'General', year: 2023, closingRank: 331 },
    ]
  });

  // Create a Demo User
  const user = await prisma.user.create({
    data: {
      email: 'demo@campusiq.com',
      name: 'Demo User',
      passwordHash: 'mock-hash-for-now-no-auth-yet'
    }
  });

  // Save some colleges
  await prisma.savedCollege.createMany({
    data: [
      { userId: user.id, collegeId: iitm.id },
      { userId: user.id, collegeId: bits.id },
    ]
  });

  console.log('Seed process completed successfully.');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
