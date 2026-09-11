"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X, ArrowUpDown, AlertCircle } from "lucide-react";
import { CollegeCard } from "@/components/college/CollegeCard";
import { apiClient } from "@/lib/api/client";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

function CollegesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [colleges, setColleges] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [metadata, setMetadata] = useState<any>({ states: [], courses: [] });

  // Filter States initialized from URL
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [stateFilter, setStateFilter] = useState(searchParams.get("state") || "");
  const [courseFilter, setCourseFilter] = useState(searchParams.get("course") || "");
  const [typeFilter, setTypeFilter] = useState(searchParams.get("collegeType") || "");
  const [maxFees, setMaxFees] = useState(searchParams.get("maxFees") || "1000000");
  const [sort, setSort] = useState(searchParams.get("sort") || "rating");
  const page = parseInt(searchParams.get("page") || "1");

  useEffect(() => {
    async function loadMetadata() {
      try {
        const data = await apiClient.getMetadata();
        setMetadata(data);
      } catch (err) {
        console.warn("Failed to load metadata", err);
      }
    }
    loadMetadata();
  }, []);

  const fetchColleges = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = Object.fromEntries(searchParams.entries());
      const response = await apiClient.getColleges(params);
      setColleges(response.data);
      setPagination(response.pagination);
    } catch (err: any) {
      setError(err.message || "Failed to load colleges. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchColleges();
  }, [fetchColleges]);

  // Update URL on filter change (debounced for search would be ideal, but direct for now)
  const applyFilters = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (stateFilter) params.set("state", stateFilter);
    if (courseFilter) params.set("course", courseFilter);
    if (typeFilter) params.set("collegeType", typeFilter);
    if (maxFees && maxFees !== "1000000") params.set("maxFees", maxFees);
    if (sort && sort !== "rating") params.set("sort", sort);
    params.set("page", "1"); // Reset to page 1 on filter change
    
    router.push(`/colleges?${params.toString()}`);
    setMobileFiltersOpen(false);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/colleges?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStateFilter("");
    setCourseFilter("");
    setTypeFilter("");
    setMaxFees("1000000");
    setSort("rating");
    router.push("/colleges");
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 flex flex-col lg:flex-row gap-8 min-h-screen">
      
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-slate-900">Explore Colleges</h1>
        <Button variant="outline" size="sm" onClick={() => setMobileFiltersOpen(true)} className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4" /> Filters
        </Button>
      </div>

      {/* Sidebar Filters */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 bg-black/20 z-40 lg:hidden" onClick={() => setMobileFiltersOpen(false)} />
      )}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 lg:bg-transparent lg:border-none lg:static lg:w-64 lg:block shrink-0
        transition-transform duration-300 ease-in-out
        ${mobileFiltersOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <div className="h-full flex flex-col overflow-y-auto p-6 lg:p-0 lg:sticky lg:top-24">
          
          <div className="flex justify-between items-center lg:hidden mb-6">
            <h2 className="text-lg font-bold text-slate-900">Filters</h2>
            <Button variant="ghost" size="icon" onClick={() => setMobileFiltersOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="hidden lg:flex items-center justify-between mb-6">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </h3>
            <button onClick={clearFilters} className="text-xs text-blue-600 hover:underline font-medium">Clear all</button>
          </div>
          
          <div className="space-y-8 flex-1">
            {/* State Filter */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-900">State / Location</label>
              <Select value={stateFilter} onChange={e => setStateFilter(e.target.value)}>
                <option value="">All States</option>
                {metadata.states.map((s: string) => <option key={s} value={s}>{s}</option>)}
              </Select>
            </div>

            {/* Course Filter */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-900">Course / Branch</label>
              <Select value={courseFilter} onChange={e => setCourseFilter(e.target.value)}>
                <option value="">All Courses</option>
                {metadata.courses.map((c: any) => <option key={c.name} value={c.name}>{c.name}</option>)}
              </Select>
            </div>

            {/* College Type */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-900">Institution Type</label>
              <Select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                <option value="">All Types</option>
                <option value="Public">Public / Government</option>
                <option value="Private">Private</option>
                <option value="Deemed University">Deemed University</option>
              </Select>
            </div>

            {/* Fees */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-900">Maximum Annual Fees</label>
              <div className="pt-2">
                <input 
                  type="range" 
                  min="50000" 
                  max="1000000" 
                  step="50000"
                  value={maxFees}
                  onChange={e => setMaxFees(e.target.value)}
                  className="w-full accent-blue-600" 
                />
                <div className="flex justify-between text-xs text-slate-500 mt-2 font-medium">
                  <span>₹50K</span>
                  <span>{parseInt(maxFees) >= 1000000 ? "₹10L+" : `₹${parseInt(maxFees)/100000}L`}</span>
                </div>
              </div>
            </div>
            
            <Button className="w-full" onClick={applyFilters}>Apply Filters</Button>
          </div>
          
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        <h1 className="text-2xl font-bold text-slate-900 mb-6 hidden lg:block">Explore Colleges</h1>
        
        {/* Search & Sort Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
          <div className="relative w-full sm:max-w-md flex">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input 
              type="text" 
              placeholder="Search by college name, city..." 
              className="pl-9 border-transparent shadow-none focus-visible:ring-0 bg-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
            />
            <Button size="sm" variant="ghost" onClick={applyFilters}>Search</Button>
          </div>
          
          <div className="w-px h-6 bg-slate-200 hidden sm:block"></div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto px-2 pb-2 sm:pb-0">
            <span className="text-sm text-slate-500 whitespace-nowrap flex items-center gap-1">
              <ArrowUpDown className="h-3.5 w-3.5" /> Sort
            </span>
            <Select 
              className="border-transparent shadow-none focus-visible:ring-0 w-full sm:w-[180px] bg-transparent font-medium"
              value={sort}
              onChange={e => { setSort(e.target.value); setTimeout(applyFilters, 0); }}
            >
              <option value="rating">Rating: High to Low</option>
              <option value="fees-low-to-high">Fees: Low to High</option>
              <option value="fees-high-to-low">Fees: High to Low</option>
              <option value="average-package">Package: High to Low</option>
              <option value="placement-rate">Placement: High to Low</option>
              <option value="name">Name: A to Z</option>
            </Select>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="p-4 mb-6 bg-red-50 text-red-800 rounded-lg border border-red-200 flex items-center gap-3">
            <AlertCircle className="h-5 w-5" />
            <p>{error}</p>
          </div>
        )}

        {/* Results Info */}
        <div className="mb-6 flex justify-between items-center text-sm">
          {isLoading ? (
            <Skeleton className="h-5 w-32" />
          ) : pagination && (
            <span className="text-slate-600 font-medium">
              Showing <strong className="text-slate-900">{colleges.length}</strong> of {pagination.total} colleges
            </span>
          )}
        </div>

        {/* Results Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="grid grid-cols-2 gap-4"><Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" /></div>
                <div className="flex gap-3 pt-4"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></div>
              </div>
            ))}
          </div>
        ) : colleges.length > 0 ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {colleges.map(college => (
              <CollegeCard key={college.id} college={college} />
            ))}
          </div>
        ) : !error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-xl border border-slate-200 border-dashed">
            <div className="bg-slate-50 p-4 rounded-full mb-4">
              <Search className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No colleges found</h3>
            <p className="text-slate-500 max-w-sm mb-6">
              We couldn't find any colleges matching your current filters. Try adjusting them.
            </p>
            <Button variant="outline" onClick={clearFilters}>
              Clear All Filters
            </Button>
          </div>
        ) : null}

        {/* Pagination */}
        {!isLoading && pagination && pagination.totalPages > 1 && (
          <div className="mt-12 flex justify-center border-t border-slate-200 pt-8">
            <nav className="flex items-center gap-1 sm:gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={!pagination.hasPrevious}
                onClick={() => handlePageChange(pagination.page - 1)}
              >
                Previous
              </Button>
              <span className="px-4 text-sm font-medium text-slate-600">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={!pagination.hasNext}
                onClick={() => handlePageChange(pagination.page + 1)}
              >
                Next
              </Button>
            </nav>
          </div>
        )}
      </main>
    </div>
  );
}

export default function CollegesPage() {
  return (
    <Suspense fallback={<div className="container mx-auto p-8"><Skeleton className="w-full h-96" /></div>}>
      <CollegesContent />
    </Suspense>
  );
}
