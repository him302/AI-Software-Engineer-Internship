import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, Star, Bookmark, GraduationCap } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatCurrency, formatLakhs } from "@/lib/utils";
import { useAuth } from "@/components/auth/AuthProvider";
import { savedClient } from "@/lib/api/auth";

interface CollegeCardProps {
  college: any;
}

export function CollegeCard({ college }: CollegeCardProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    setIsSaving(true);
    try {
      await savedClient.saveCollege(college.id);
      alert("College saved!"); // A toast would be better in a real app
    } catch (error) {
      console.error(error);
      alert("Failed to save college");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="group flex flex-col justify-between overflow-hidden transition-all hover:shadow-md hover:border-slate-300">
      <CardContent className="p-5">
        <div className="flex justify-between items-start gap-4 mb-4">
          <div className="space-y-1.5 min-w-0">
            <h3 className="font-semibold text-lg text-slate-900 leading-tight truncate">
              {college.name}
            </h3>
            <div className="flex items-center text-sm text-slate-500 truncate">
              <MapPin className="mr-1.5 h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{college.location}, {college.state}</span>
            </div>
          </div>
          <button 
            onClick={handleSave} 
            disabled={isSaving}
            className="text-slate-400 hover:text-blue-600 transition-colors shrink-0 p-1"
          >
            <Bookmark className={`h-5 w-5 ${isSaving ? 'animate-pulse' : ''}`} />
            <span className="sr-only">Save {college.name}</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-5">
          <Badge variant="warning" className="flex items-center">
            <Star className="mr-1 h-3 w-3 fill-amber-500 text-amber-500" />
            {Number(college.rating).toFixed(1)} / 5
          </Badge>
          <Badge variant="secondary">{college.collegeType}</Badge>
          {college.popularCourse && (
            <Badge variant="outline" className="text-slate-600 bg-slate-50 border-slate-200 flex items-center">
              <GraduationCap className="mr-1 h-3 w-3" />
              {college.popularCourse}
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm bg-slate-50/50 p-3 rounded-lg border border-slate-100">
          <div className="flex flex-col space-y-1">
            <span className="text-slate-500 text-xs font-medium uppercase tracking-wider">Annual Fees</span>
            <span className="font-semibold text-slate-900">
              {formatCurrency(college.annualFees)}
            </span>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-slate-500 text-xs font-medium uppercase tracking-wider">Avg Package</span>
            <span className="font-semibold text-green-700">
              {formatLakhs(college.averagePackage)}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0 flex gap-3 border-t border-slate-100 bg-slate-50/30 mt-auto flex-col sm:flex-row">
        <Button asChild className="w-full sm:flex-1" variant="default">
          <Link href={`/colleges/${college.slug}`}>View Details</Link>
        </Button>
        <Button asChild className="w-full sm:flex-1" variant="outline">
          <Link href={`/compare?ids=${college.slug}`}>Compare</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
