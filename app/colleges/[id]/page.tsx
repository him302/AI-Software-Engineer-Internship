"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, Star, Bookmark, ExternalLink, ShieldCheck, Download, GraduationCap, Building2 } from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatLakhs } from "@/lib/utils";
import { use } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { savedClient } from "@/lib/api/auth";
import { useRouter } from "next/navigation";

export default function CollegeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { user } = useAuth();
  const router = useRouter();
  const [college, setCollege] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      setError(false);
      try {
        // The id parameter from URL is actually the slug based on our database design
        const data = await apiClient.getCollegeBySlug(resolvedParams.id);
        setCollege(data);
      } catch (err) {
        console.warn(err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [resolvedParams.id]);

  if (isLoading) {
    return (
      <div className="bg-slate-50 min-h-screen pb-24 animate-pulse">
        <div className="bg-white border-b border-slate-200 h-64"></div>
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-96 w-full" />
            </div>
            <div className="space-y-8">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !college) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">College Not Found</h1>
        <p className="text-slate-500 mb-6">The college you are looking for does not exist or has been removed.</p>
        <Button asChild><Link href="/colleges">Back to Colleges</Link></Button>
      </div>
    );
  }

  const latestPlacement = college.placements?.[0] || null;

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* College Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm relative z-10">
        <div className="container mx-auto px-4 md:px-6 py-6 md:py-8">
          <Link href="/colleges" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 mb-6 transition-colors">
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to Search
          </Link>
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge variant="secondary">{college.collegeType}</Badge>
                <Badge variant="warning" className="flex items-center">
                  <Star className="mr-1 h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                  {Number(college.rating).toFixed(1)} Rating
                </Badge>
                <Badge variant="success" className="flex items-center">
                  <ShieldCheck className="mr-1 h-3 w-3" /> Verified Data
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 tracking-tight">{college.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-slate-600 text-sm font-medium">
                <span className="flex items-center"><MapPin className="mr-1 h-4 w-4 text-slate-400" /> {college.location}, {college.state}</span>
                {college.establishedYear && (
                  <span className="flex items-center"><Building2 className="mr-1 h-4 w-4 text-slate-400" /> Est. {college.establishedYear}</span>
                )}
                {college.website && (
                  <a href={college.website} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:text-blue-700 hover:underline">
                    <ExternalLink className="mr-1 h-4 w-4" /> Official Website
                  </a>
                )}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
              <Button variant="outline" className="w-full sm:w-auto" onClick={async () => {
                if (!user) {
                  router.push("/login");
                  return;
                }
                try {
                  await savedClient.saveCollege(college.id);
                  alert("College saved successfully!");
                } catch(e) {
                  console.warn(e);
                  alert("Failed to save.");
                }
              }}>
                <Bookmark className="mr-2 h-4 w-4" /> Save
              </Button>
              <Button asChild className="w-full sm:w-auto">
                <Link href={`/compare?id=${college.slug}`}>Compare</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content (Left) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Overview */}
            <section className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4">About the Institute</h2>
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                {college.description || "No description provided."}
              </p>
            </section>

            {/* Courses & Fees */}
            <section className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <div className="flex justify-between items-end mb-6">
                <h2 className="text-xl font-bold text-slate-900">Programs & Fees</h2>
              </div>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-xs font-semibold">
                    <tr>
                      <th className="px-4 py-3">Course Name</th>
                      <th className="px-4 py-3">Degree</th>
                      <th className="px-4 py-3 text-right">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {college.courses?.map((cc: any) => (
                      <tr key={cc.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 font-medium text-slate-900">{cc.course.name}</td>
                        <td className="px-4 py-3 text-slate-600">{cc.course.degree}</td>
                        <td className="px-4 py-3 text-right font-medium text-slate-900">
                          {cc.course.duration} Years
                        </td>
                      </tr>
                    ))}
                    {(!college.courses || college.courses.length === 0) && (
                      <tr>
                        <td colSpan={3} className="px-4 py-8 text-center text-slate-500">
                          Detailed course information is currently unavailable.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Sidebar (Right) */}
          <div className="space-y-8">
            {/* Key Statistics Cards */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Key Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 flex flex-col justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Avg Package</span>
                  <div className="text-xl font-bold text-green-700">{latestPlacement ? formatLakhs(latestPlacement.averagePackage) : formatLakhs(college.averagePackage)}</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 flex flex-col justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Placement</span>
                  <div className="text-xl font-bold text-slate-900">{latestPlacement ? Number(latestPlacement.placementRate).toFixed(1) : Number(college.placementRate).toFixed(1)}%</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 flex flex-col justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Highest</span>
                  <div className="text-xl font-bold text-slate-900">{latestPlacement ? (latestPlacement.highestPackage / 10000000).toFixed(2) : (college.highestPackage / 10000000).toFixed(2)} Cr</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 flex flex-col justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Ann. Fees</span>
                  <div className="text-xl font-bold text-slate-900">{formatCurrency(college.annualFees)}</div>
                </div>
              </div>
            </div>
            
            {/* Action Card */}
            <div className="bg-blue-600 rounded-xl border border-blue-700 p-6 shadow-sm text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <GraduationCap className="h-24 w-24" />
              </div>
              <div className="relative z-10">
                <h3 className="font-bold text-lg mb-2">Will you get in?</h3>
                <p className="text-blue-100 text-sm mb-6 max-w-[85%]">
                  Enter your entrance exam rank and preferences to see your admission probability.
                </p>
                <Button asChild variant="secondary" className="w-full bg-white text-blue-700 hover:bg-blue-50">
                  <Link href="/predictor">Check My Chances</Link>
                </Button>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
