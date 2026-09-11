import Link from "next/link";
import { BookOpen } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="bg-blue-600 p-1.5 rounded-md">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">CampusIQ</span>
            </Link>
            <p className="text-sm text-slate-500 mb-6 max-w-xs">
              Discover your best-fit college using structured data and intelligent insights.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Product</h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li><Link href="/colleges" className="hover:text-slate-900">Explore</Link></li>
              <li><Link href="/compare" className="hover:text-slate-900">Compare</Link></li>
              <li><Link href="/predictor" className="hover:text-slate-900">Predictor</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Resources</h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li><Link href="#" className="hover:text-slate-900">College Reviews</Link></li>
              <li><Link href="#" className="hover:text-slate-900">Data Methodology</Link></li>
              <li><Link href="#" className="hover:text-slate-900">Help Center</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Company</h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li><Link href="#" className="hover:text-slate-900">About</Link></li>
              <li><Link href="#" className="hover:text-slate-900">Privacy</Link></li>
              <li><Link href="#" className="hover:text-slate-900">Terms</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-slate-200 text-sm text-slate-500 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} CampusIQ. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-slate-900">Twitter</Link>
            <Link href="#" className="hover:text-slate-900">GitHub</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
