"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { savedClient } from "@/lib/api/auth";
import { CollegeCard } from "@/components/college/CollegeCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Bookmark, AlertCircle } from "lucide-react";

export default function SavedPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  
  const [savedColleges, setSavedColleges] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function loadSaved() {
      if (!user) return;
      setIsLoading(true);
      setError(null);
      try {
        const data = await savedClient.getSavedColleges();
        setSavedColleges(data);
      } catch (err: any) {
        setError(err.message || "Failed to load saved colleges.");
      } finally {
        setIsLoading(false);
      }
    }
    loadSaved();
  }, [user]);

  if (authLoading || (!user && isLoading)) {
    return (
      <div className="container mx-auto px-4 py-24">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">My Saved Colleges</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-64 w-full rounded-xl" />)}
        </div>
      </div>
    );
  }

  if (!user) return null; // Let the redirect handle it

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Saved Colleges</h1>
            <p className="text-slate-500 mt-2">Manage and compare your shortlisted colleges here.</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/colleges">Discover More</Link>
          </Button>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 text-red-800 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="h-5 w-5" />
            <p>{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-64 w-full rounded-xl" />)}
          </div>
        ) : savedColleges.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-slate-200 border-dashed shadow-sm">
            <div className="bg-slate-50 p-4 rounded-full mb-4">
              <Bookmark className="h-10 w-10 text-slate-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">No saved colleges yet</h2>
            <p className="text-slate-500 max-w-sm mb-6">
              Save colleges while exploring CampusIQ and they'll appear here for easy comparison.
            </p>
            <Button asChild>
              <Link href="/colleges">Explore Colleges</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedColleges.map((saved) => (
              <CollegeCard key={saved.id} college={saved.college} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
