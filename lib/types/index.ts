export interface Course {
  id: string;
  name: string;
  level: "UG" | "PG";
  duration: number; // in years
  fees?: number;
}

export interface Placement {
  id: string;
  year: number;
  averagePackage: number;
  highestPackage: number;
  placementRate: number;
}

export interface Cutoff {
  id: string;
  exam: string;
  category: string;
  closingRank: number;
  courseId?: string;
}

export interface College {
  id: string;
  name: string;
  slug: string;
  location: string;
  state: string;
  type: "Public" | "Private";
  rating: number;
  description: string;
  annualFees: number;
  averagePackage: number;
  highestPackage: number;
  placementRate: number;
  website: string;
  establishedYear: number;
  popularCourse?: string;
  
  // Relations that might be included in detailed views
  courses?: Course[];
  placements?: Placement[];
  cutoffs?: Cutoff[];
  pros?: string[];
  cons?: string[];
  topRecruiters?: string[];
}

export interface PredictorInput {
  exam: string;
  rank: number;
  category: string;
  courseId?: string;
  maxBudget?: number;
  state?: string;
}

export interface PredictorResult {
  college: College;
  matchLevel: "Strong Match" | "Possible" | "Ambitious";
  reasons: string[];
}
