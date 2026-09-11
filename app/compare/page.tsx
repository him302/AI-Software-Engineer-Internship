"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Plus, X, Star, CheckCircle2, AlertCircle } from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatLakhs } from "@/lib/utils";

import { Suspense } from "react";

function CompareContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [colleges, setColleges] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      const idsParam = searchParams.get('ids');
      const idParam = searchParams.get('id'); // Fallback if single id passed from detail page
      
      let idsToFetch: string[] = [];
      if (idsParam) {
        idsToFetch = idsParam.split(',').filter(Boolean);
      } else if (idParam) {
        idsToFetch = [idParam];
      }

      if (idsToFetch.length === 0) {
        setIsLoading(false);
        return; // Render empty state
      }

      setIsLoading(true);
      setError(null);
      try {
        const data = await apiClient.getComparison(idsToFetch);
        setColleges(data);
      } catch (err: any) {
        setError(err.message || "Failed to load comparison data.");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [searchParams]);

  const removeCollege = (slug: string) => {
    const updatedColleges = colleges.filter(c => c.slug !== slug);
    setColleges(updatedColleges);
    
    // Update URL
    if (updatedColleges.length > 0) {
      const newIds = updatedColleges.map(c => c.slug).join(',');
      router.push(`/compare?ids=${newIds}`);
    } else {
      router.push(`/compare`);
    }
  };

  if (isLoading) {
    return <div className="container mx-auto px-4 py-24 text-center animate-pulse text-slate-500 font-medium">Loading comparison data...</div>;
  }

  // Calculate best values to highlight
  const highestPackage = colleges.length > 0 ? Math.max(...colleges.map(c => c.averagePackage), 0) : 0;
  const lowestFees = colleges.length > 0 ? Math.min(...colleges.map(c => c.annualFees), Infinity) : 0;
  const highestRating = colleges.length > 0 ? Math.max(...colleges.map(c => Number(c.rating)), 0) : 0;
  const highestPlacement = colleges.length > 0 ? Math.max(...colleges.map(c => Number(c.placementRate)), 0) : 0;

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 pb-24">
      <div className="mb-10 text-center max-w-2xl mx-auto relative">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">Compare Colleges</h1>
        <p className="text-lg text-slate-600">
          Put colleges side by side to make an informed, data-driven decision.
        </p>
        
        {colleges.length >= 2 && (
          <div className="mt-6 flex justify-center">
            <Button 
              variant="default" 
              className="gap-2"
              onClick={async () => {
                try {
                  const ids = colleges.map(c => c.id);
                  await apiClient.saveComparison(ids);
                  alert('Comparison saved successfully! You can view it in your Saved tab.');
                } catch (err: any) {
                  if (err.message?.includes('Authentication')) {
                    router.push('/login');
                  } else {
                    alert(err.message || 'Failed to save comparison');
                  }
                }
              }}
            >
              <CheckCircle2 className="h-4 w-4" /> Save this Comparison
            </Button>
          </div>
        )}
      </div>

      {error ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-red-200 shadow-sm">
          <AlertCircle className="h-10 w-10 text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Error Loading Comparison</h2>
          <p className="text-slate-500 max-w-sm mb-6 text-center">{error}</p>
          <Button onClick={() => router.push('/colleges')}>Return to Search</Button>
        </div>
      ) : colleges.length < 2 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-slate-200 border-dashed">
          <div className="bg-slate-50 p-4 rounded-full mb-4">
            <AlertCircle className="h-10 w-10 text-slate-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            {colleges.length === 1 ? "Add another college to compare" : "No colleges selected"}
          </h2>
          <p className="text-slate-500 max-w-sm mb-6 text-center">
            {colleges.length === 1 
              ? `You have selected ${colleges[0].name}. Select at least one more college to see a side-by-side comparison.`
              : `Select at least two colleges from the discovery page to compare their fees, placements, and ratings.`}
          </p>
          <div className="flex gap-4">
            {colleges.length === 1 && (
              <Button variant="outline" onClick={() => removeCollege(colleges[0].slug)}>Clear Selection</Button>
            )}
            <Button asChild>
              <Link href="/colleges">Explore Colleges</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto hide-scrollbar">
            <div className="min-w-[800px]">
              
              {/* Table Header / Selection */}
              <div className="grid grid-cols-4 divide-x divide-slate-200 border-b border-slate-200 bg-slate-50">
                <div className="p-6 flex flex-col justify-end">
                  <h3 className="font-semibold text-slate-900 text-sm uppercase tracking-wider">Comparison Parameters</h3>
                </div>
                
                {colleges.map((college) => (
                  <div key={college.id} className="p-6 relative group flex flex-col items-start bg-white">
                    <button 
                      onClick={() => removeCollege(college.slug)}
                      className="absolute top-4 right-4 h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-red-100 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100 md:opacity-100"
                      aria-label="Remove college"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center font-bold text-blue-700 text-xl mb-4">
                      {college.name.charAt(0)}
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 mb-1 leading-tight">{college.name}</h3>
                    <p className="text-sm text-slate-500 mb-4">{college.location}, {college.state}</p>
                    <div className="mt-auto">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/colleges/${college.slug}`}>View Details</Link>
                      </Button>
                    </div>
                  </div>
                ))}
                
                {colleges.length < 3 && (
                  <div className="p-6 flex flex-col items-center justify-center min-h-[240px] bg-slate-50 border-l border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer group">
                    <Link href="/colleges" className="flex flex-col items-center justify-center w-full h-full">
                      <div className="h-14 w-14 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 group-hover:text-blue-600 group-hover:border-blue-600 group-hover:bg-blue-50 transition-colors mb-4">
                        <Plus className="h-6 w-6" />
                      </div>
                      <span className="text-sm font-semibold text-slate-600 group-hover:text-blue-600">Add College</span>
                    </Link>
                  </div>
                )}
                {colleges.length < 2 && (
                  <div className="p-6 flex flex-col items-center justify-center min-h-[240px] bg-slate-50 border-l border-slate-200">
                  </div>
                )}
              </div>

              {/* Comparison Rows */}
              <div className="divide-y divide-slate-200">
                
                {/* Rating */}
                <div className="grid grid-cols-4 divide-x divide-slate-200 hover:bg-slate-50 transition-colors">
                  <div className="p-5 font-medium text-slate-600 flex items-center bg-white">Overall Rating</div>
                  {colleges.map((college) => (
                    <div key={college.id} className="p-5 flex flex-col justify-center bg-white">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                        <span className="font-bold text-slate-900">{Number(college.rating).toFixed(1)}</span>
                        <span className="text-xs text-slate-500">/ 5</span>
                        {Number(college.rating) === highestRating && (
                          <Badge variant="success" className="ml-auto text-[10px] h-5 px-1.5"><CheckCircle2 className="w-3 h-3 mr-1"/> Highest</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                  {colleges.length < 3 && <div className="p-5 bg-slate-50"></div>}
                  {colleges.length < 2 && <div className="p-5 bg-slate-50"></div>}
                </div>

                {/* Type */}
                <div className="grid grid-cols-4 divide-x divide-slate-200 hover:bg-slate-50 transition-colors">
                  <div className="p-5 font-medium text-slate-600 flex items-center bg-white">Institution Type</div>
                  {colleges.map((college) => (
                    <div key={college.id} className="p-5 text-slate-900 font-medium bg-white">
                      {college.collegeType}
                    </div>
                  ))}
                  {colleges.length < 3 && <div className="p-5 bg-slate-50"></div>}
                  {colleges.length < 2 && <div className="p-5 bg-slate-50"></div>}
                </div>

                {/* Fees */}
                <div className="grid grid-cols-4 divide-x divide-slate-200 hover:bg-slate-50 transition-colors">
                  <div className="p-5 font-medium text-slate-600 flex items-center bg-white">Annual Fees</div>
                  {colleges.map((college) => (
                    <div key={college.id} className="p-5 bg-white">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">
                          {formatCurrency(college.annualFees)}
                        </span>
                        {college.annualFees === lowestFees && (
                          <Badge variant="success" className="text-[10px] h-5 px-1.5"><CheckCircle2 className="w-3 h-3 mr-1"/> Most Affordable</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                  {colleges.length < 3 && <div className="p-5 bg-slate-50"></div>}
                  {colleges.length < 2 && <div className="p-5 bg-slate-50"></div>}
                </div>

                {/* Average Package */}
                <div className="grid grid-cols-4 divide-x divide-slate-200 hover:bg-slate-50 transition-colors">
                  <div className="p-5 font-medium text-slate-600 flex items-center bg-white">Average Package</div>
                  {colleges.map((college) => (
                    <div key={college.id} className={`p-5 flex flex-col justify-center ${college.averagePackage === highestPackage ? 'bg-green-50/30' : 'bg-white'}`}>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-green-700 text-lg">
                          {formatLakhs(college.averagePackage)}
                        </span>
                        {college.averagePackage === highestPackage && (
                          <Badge variant="success" className="text-[10px] h-5 px-1.5"><CheckCircle2 className="w-3 h-3 mr-1"/> Highest ROI</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                  {colleges.length < 3 && <div className="p-5 bg-slate-50"></div>}
                  {colleges.length < 2 && <div className="p-5 bg-slate-50"></div>}
                </div>

                {/* Placement Rate */}
                <div className="grid grid-cols-4 divide-x divide-slate-200 hover:bg-slate-50 transition-colors">
                  <div className="p-5 font-medium text-slate-600 flex items-center bg-white">Placement Rate</div>
                  {colleges.map((college) => (
                    <div key={college.id} className="p-5 bg-white">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-slate-900">{Number(college.placementRate).toFixed(1)}%</span>
                        {Number(college.placementRate) === highestPlacement && (
                          <Badge variant="success" className="text-[10px] h-5 px-1.5"><CheckCircle2 className="w-3 h-3 mr-1"/> Best</Badge>
                        )}
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${Number(college.placementRate)}%` }}></div>
                      </div>
                    </div>
                  ))}
                  {colleges.length < 3 && <div className="p-5 bg-slate-50"></div>}
                  {colleges.length < 2 && <div className="p-5 bg-slate-50"></div>}
                </div>

                {/* Popular Course */}
                <div className="grid grid-cols-4 divide-x divide-slate-200 hover:bg-slate-50 transition-colors border-b border-slate-200">
                  <div className="p-5 font-medium text-slate-600 flex items-center bg-white rounded-bl-2xl">Popular Course</div>
                  {colleges.map((college) => (
                    <div key={college.id} className="p-5 text-sm text-slate-700 font-medium bg-white">
                      {college.popularCourse || "N/A"}
                    </div>
                  ))}
                  {colleges.length < 3 && <div className="p-5 bg-slate-50 rounded-br-2xl"></div>}
                  {colleges.length < 2 && <div className="p-5 bg-slate-50"></div>}
                </div>
                
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="container mx-auto p-8 text-center">Loading comparison...</div>}>
      <CompareContent />
    </Suspense>
  );
}
