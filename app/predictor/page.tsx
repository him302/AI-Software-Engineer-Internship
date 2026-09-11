"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Target, GraduationCap, ChevronRight, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { apiClient } from "@/lib/api/client";

export default function PredictorPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);
  const [disclaimer, setDisclaimer] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<any>({ exams: [], courses: [], states: [] });
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [exam, setExam] = useState("");
  const [rank, setRank] = useState("");
  const [category, setCategory] = useState("General");
  const [course, setCourse] = useState("");
  const [budget, setBudget] = useState("");
  const [preferredState, setPreferredState] = useState("");

  useEffect(() => {
    apiClient.getMetadata().then(setMetadata).catch(console.warn);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await apiClient.predict({
        exam,
        rank: parseInt(rank, 10),
        category: category as any,
        course: course || undefined,
        budget: budget ? parseInt(budget, 10) : undefined,
        preferredState: preferredState || undefined
      });
      setResults(response.results);
      setDisclaimer(response.disclaimer);
    } catch (err: any) {
      setError(err.message || "Failed to generate predictions.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMatchBadge = (level: string) => {
    switch(level) {
      case "Strong Match": return <Badge variant="success" className="mb-2"><CheckCircle2 className="w-3 h-3 mr-1" /> Strong Match</Badge>;
      case "Possible": return <Badge variant="warning" className="mb-2"><AlertCircle className="w-3 h-3 mr-1" /> Possible</Badge>;
      case "Ambitious": return <Badge variant="destructive" className="mb-2 bg-red-100 text-red-800 hover:bg-red-200"><AlertCircle className="w-3 h-3 mr-1" /> Ambitious</Badge>;
      default: return null;
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 mb-4 border border-blue-200">
            <Sparkles className="h-4 w-4 mr-2" /> AI-Powered Predictions
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">College Predictor</h1>
          <p className="text-lg text-slate-600">
            Enter your details below to see which colleges match your profile based on historical cutoff data.
          </p>
        </div>

        {results ? (
          <div className="max-w-4xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Your College Matches</h2>
              <Button variant="outline" onClick={() => setResults(null)}>
                <ArrowLeft className="w-4 h-4 mr-2" /> Modify Details
              </Button>
            </div>
            
            {disclaimer && (
              <p className="text-sm text-slate-500 mb-8 flex items-start bg-blue-50 p-4 rounded-lg border border-blue-100">
                <AlertCircle className="w-5 h-5 text-blue-600 mr-2 shrink-0 mt-0.5" />
                <span><strong>Disclaimer:</strong> {disclaimer}</span>
              </p>
            )}

            {results.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
                <AlertCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">No Matches Found</h3>
                <p className="text-slate-500 max-w-md mx-auto">
                  We couldn't find any historical cutoffs matching your exact criteria. Try adjusting your preferences, budget, or preferred state.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {results.map((result, idx) => (
                  <div key={idx} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col md:flex-row">
                    <div className="p-6 md:w-1/3 bg-slate-50 border-b md:border-b-0 md:border-r border-slate-200 flex flex-col justify-center">
                      {getMatchBadge(result.matchLevel)}
                      <h3 className="text-xl font-bold text-slate-900 mb-1 leading-tight">{result.college.name}</h3>
                      <p className="text-sm text-slate-500 mb-4">{result.college.location}</p>
                      <div className="mt-auto pt-4 flex gap-2">
                        <Button asChild size="sm" variant="default" className="flex-1">
                          <Link href={`/colleges/${result.college.slug}`}>View Details</Link>
                        </Button>
                      </div>
                    </div>
                    <div className="p-6 md:w-2/3">
                      <h4 className="font-semibold text-slate-900 mb-3 text-sm uppercase tracking-wider">Why we recommend this</h4>
                      <ul className="space-y-3">
                        {result.reasons.map((reason: string, i: number) => (
                          <li key={i} className="flex items-start text-slate-700 text-sm">
                            <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 shrink-0" />
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            
            {error && (
              <div className="p-4 bg-red-50 text-red-800 border-b border-red-200 flex items-center gap-3">
                <AlertCircle className="h-5 w-5" />
                <p>{error}</p>
              </div>
            )}

            <div className="p-6 md:p-10">
              <form onSubmit={handleSubmit} className="space-y-8">
                
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                    <Target className="h-5 w-5 text-blue-600" /> Entrance Exam Details
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-900">Entrance Exam</label>
                      <Select required value={exam} onChange={e => setExam(e.target.value)}>
                        <option value="">Select Exam</option>
                        {metadata.exams.map((e: any) => <option key={e.slug} value={e.name}>{e.name}</option>)}
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-900">Rank / Score</label>
                      <Input type="number" placeholder="e.g. 4500" required value={rank} onChange={e => setRank(e.target.value)} />
                    </div>

                    <div className="space-y-3 md:col-span-2">
                      <label className="text-sm font-semibold text-slate-900">Category</label>
                      <div className="flex flex-wrap gap-3">
                        {["General", "OBC", "SC", "ST", "EWS"].map((cat) => (
                          <label key={cat} className="flex-1 min-w-[100px] cursor-pointer">
                            <input 
                              type="radio" 
                              name="category" 
                              className="peer sr-only" 
                              checked={category === cat}
                              onChange={() => setCategory(cat)}
                            />
                            <div className="rounded-md border border-slate-200 bg-white px-4 py-2.5 text-center text-sm font-medium text-slate-600 hover:bg-slate-50 peer-checked:border-blue-600 peer-checked:bg-blue-50 peer-checked:text-blue-700 transition-colors shadow-sm">
                              {cat}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 space-y-6">
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                    <GraduationCap className="h-5 w-5 text-blue-600" /> Preferences <span className="text-sm font-normal text-slate-400">(Optional)</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-900">Preferred Course</label>
                      <Select value={course} onChange={e => setCourse(e.target.value)}>
                        <option value="">Any Course</option>
                        {metadata.courses.map((c: any) => <option key={c.name} value={c.name}>{c.name}</option>)}
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-900">Max Budget (Annual)</label>
                      <Select value={budget} onChange={e => setBudget(e.target.value)}>
                        <option value="">No limit</option>
                        <option value="200000">Under ₹2 Lakhs</option>
                        <option value="500000">Under ₹5 Lakhs</option>
                        <option value="1000000">Under ₹10 Lakhs</option>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-900">Preferred State</label>
                      <Select value={preferredState} onChange={e => setPreferredState(e.target.value)}>
                        <option value="">Any State</option>
                        {metadata.states.map((s: string) => <option key={s} value={s}>{s}</option>)}
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="pt-6 flex justify-end">
                  <Button type="submit" size="lg" className="w-full md:w-auto text-base" disabled={isSubmitting || metadata.exams.length === 0}>
                    {isSubmitting ? "Analyzing..." : "Find My Colleges"} 
                    {!isSubmitting && <ChevronRight className="ml-2 h-4 w-4" />}
                  </Button>
                </div>

              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
