"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, Menu, X, User } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthProvider";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isLoading, logout } = useAuth();

  const navLinks = [
    { name: "Explore", href: "/colleges" },
    { name: "Compare", href: "/compare" },
    { name: "Predictor", href: "/predictor" },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-blue-600 text-white p-1.5 rounded-lg group-hover:bg-blue-700 transition-colors">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900">CampusIQ</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-6">
            {navLinks.map(link => (
              <li key={link.name}>
                <Link 
                  href={link.href} 
                  className={`text-sm font-medium transition-colors hover:text-blue-600 ${pathname === link.href ? "text-blue-600" : "text-slate-600"}`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
          
          <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
            {isLoading ? (
              <div className="h-9 w-24 bg-slate-100 animate-pulse rounded-md"></div>
            ) : user ? (
              <>
                <Button asChild variant="ghost" size="sm" className="text-slate-600 hover:text-blue-600">
                  <Link href="/saved">Saved</Link>
                </Button>
                <div className="flex items-center gap-2 px-2 text-sm font-medium text-slate-700 border-x border-slate-200 h-6">
                  <User className="h-4 w-4" /> {user.name.split(' ')[0]}
                </div>
                <Button variant="ghost" size="sm" onClick={logout} className="text-slate-500 hover:text-red-600">
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm" className="text-slate-600 hover:text-blue-600">
                  <Link href="/login">Log in</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/signup">Sign up</Link>
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-slate-500 hover:text-slate-900"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-4 shadow-lg absolute w-full left-0 top-16">
          <ul className="space-y-3 pb-4 border-b border-slate-100">
            {navLinks.map(link => (
              <li key={link.name}>
                <Link 
                  href={link.href} 
                  className={`block text-base font-medium ${pathname === link.href ? "text-blue-600" : "text-slate-600"}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-3 pt-2">
            {!isLoading && user ? (
              <>
                <Button asChild variant="outline" className="w-full justify-start" onClick={() => setMobileMenuOpen(false)}>
                  <Link href="/saved">My Saved Colleges</Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700" onClick={() => { logout(); setMobileMenuOpen(false); }}>
                  Log out ({user.name})
                </Button>
              </>
            ) : !isLoading && (
              <>
                <Button asChild variant="outline" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                  <Link href="/login">Log in</Link>
                </Button>
                <Button asChild className="w-full" onClick={() => setMobileMenuOpen(false)}>
                  <Link href="/signup">Sign up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
