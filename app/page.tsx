import Link from "next/link";
import { Search, MapPin, TrendingUp, Award, ArrowRight, ShieldCheck, Database, LayoutDashboard } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 md:pt-32 md:pb-40 overflow-hidden bg-white border-b border-slate-200">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>
        <div className="container relative mx-auto px-4 md:px-6 flex flex-col items-center text-center">
          <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600 mb-8">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2"></span>
            Data-Driven College Admissions
          </div>
          <h1 className="max-w-4xl text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 mb-6 leading-tight">
            Find the college that's <br className="hidden md:block" />
            <span className="text-blue-600">right for your future.</span>
          </h1>
          <p className="max-w-2xl text-lg md:text-xl text-slate-600 mb-10">
            Explore colleges, compare outcomes, and discover your best-fit options using structured data. Make your decision with confidence.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-md mx-auto sm:max-w-none">
            <Link 
              href="/colleges" 
              className="inline-flex h-12 items-center justify-center rounded-md bg-blue-600 px-8 text-base font-medium text-white shadow transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-700"
            >
              Explore Colleges
            </Link>
            <Link 
              href="/predictor" 
              className="inline-flex h-12 items-center justify-center rounded-md border border-slate-200 bg-white px-8 text-base font-medium text-slate-900 shadow-sm transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950"
            >
              Try College Predictor
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Search / Highlights */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <LayoutDashboard className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Structured Data</h3>
              <p className="text-slate-600">No more digging through forums. We aggregate fees, placements, and rankings in one clean dashboard.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Compare Outcomes</h3>
              <p className="text-slate-600">Put two colleges side by side and instantly see which offers better ROI and placement statistics.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Intelligent Predictor</h3>
              <p className="text-slate-600">Input your ranks and preferences to receive unbiased, historical data-backed recommendations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust / Data Section */}
      <section className="py-24 bg-white border-t border-slate-200">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24">
            <div className="flex-1 space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
                Built on reliable, <br /> transparent data.
              </h2>
              <p className="text-lg text-slate-600">
                We believe students deserve the truth about their future. CampusIQ normalizes messy institutional data to give you clear, actionable intelligence.
              </p>
              <ul className="space-y-4 pt-4">
                <li className="flex items-center gap-3 text-slate-700">
                  <ShieldCheck className="h-5 w-5 text-green-600" />
                  <span>Verified placement statistics and median packages</span>
                </li>
                <li className="flex items-center gap-3 text-slate-700">
                  <Database className="h-5 w-5 text-green-600" />
                  <span>Historical cutoff trends across major entrance exams</span>
                </li>
                <li className="flex items-center gap-3 text-slate-700">
                  <MapPin className="h-5 w-5 text-green-600" />
                  <span>Comprehensive location and facility breakdown</span>
                </li>
              </ul>
              <div className="pt-6">
                <Link href="/colleges" className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700">
                  Explore our methodology <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="flex-1 w-full bg-slate-50 rounded-2xl border border-slate-200 p-8 shadow-sm">
              <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm mb-4">
                <div className="h-4 w-1/3 bg-slate-200 rounded animate-pulse mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 w-full bg-slate-100 rounded animate-pulse"></div>
                  <div className="h-3 w-5/6 bg-slate-100 rounded animate-pulse"></div>
                  <div className="h-3 w-4/6 bg-slate-100 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm opacity-75 mb-4">
                <div className="h-4 w-1/4 bg-slate-200 rounded animate-pulse mb-4"></div>
                <div className="flex gap-4">
                  <div className="h-16 w-16 bg-slate-100 rounded animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-full bg-slate-100 rounded animate-pulse"></div>
                    <div className="h-3 w-3/4 bg-slate-100 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 bg-slate-900 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to make a better decision?</h2>
          <p className="text-slate-300 mb-10 max-w-2xl mx-auto text-lg">
            Join thousands of students who have used CampusIQ to find their perfect college match.
          </p>
          <Link 
            href="/signup" 
            className="inline-flex h-12 items-center justify-center rounded-md bg-white px-8 text-base font-medium text-slate-900 shadow transition-colors hover:bg-slate-100"
          >
            Create Free Account
          </Link>
        </div>
      </section>
    </div>
  );
}
