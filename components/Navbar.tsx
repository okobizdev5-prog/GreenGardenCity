"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight, ChevronDown } from "lucide-react";

type NavbarProps = {
  onBookClick?: () => void;
};

export function Navbar({ onBookClick }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProjects(data);
        }
      })
      .catch((err) => console.error("Error fetching projects for navbar:", err));
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Projects", href: "/projects", isProjectsDropdown: true },
    { name: "Blog", href: "/blog" },
    { name: "Brochures", href: "/brochures" },
    { name: "Contact Us", href: "/contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? "bg-white/95 backdrop-blur-md shadow-sm py-3 border-b border-gray-100" 
          : "bg-white py-4"
      }`}
    >
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center max-w-7xl">
        <Link href="/" className="font-bold text-2xl text-green-700 tracking-tight flex items-center gap-1 hover:opacity-90">
          Green Garden City
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1.5">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            if (link.isProjectsDropdown) {
              const phase1Projects = projects.filter(p => {
                const cat = (p.category || "").toLowerCase();
                return cat === "phase 1" || cat === "land - phase 1";
              });
              const phase2Projects = projects.filter(p => {
                const cat = (p.category || "").toLowerCase();
                return cat === "phase 2" || cat === "land - phase 2";
              });
              const apartmentProjects = projects.filter(p => {
                const cat = (p.category || "").toLowerCase();
                return cat.includes("apartment") || cat.includes("flat");
              });

              return (
                <div key={link.name} className="relative group py-2">
                  <Link
                    href={link.href}
                    className={`text-sm font-medium px-4 py-2 rounded-lg transition-all inline-flex items-center gap-1 ${
                      isActive || pathname.startsWith("/projects/")
                        ? "text-green-700 bg-green-50 font-bold" 
                        : "text-gray-600 hover:text-green-700 hover:bg-gray-50"
                    }`}
                  >
                    {link.name}
                    <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180 text-gray-400 group-hover:text-green-700" />
                  </Link>

                  {/* Dropdown Menu */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-80 bg-white border border-gray-150 rounded-2xl shadow-xl py-5 px-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 flex flex-col gap-4">
                    {/* Land category group */}
                    {(phase1Projects.length > 0 || phase2Projects.length > 0) && (
                      <div className="space-y-3 text-left">
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Land Projects</div>
                        {phase1Projects.length > 0 && (
                          <div className="space-y-1 pl-2">
                            <div className="text-xxs font-extrabold uppercase text-green-700 tracking-wider flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
                              Phase 1
                            </div>
                            <div className="flex flex-col gap-1 pl-3">
                              {phase1Projects.map((p) => (
                                <Link key={p.id} href={`/projects/${p.id}`} className="text-sm font-semibold text-gray-700 hover:text-green-700 transition">
                                  {p.title}
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                        {phase2Projects.length > 0 && (
                          <div className="space-y-1 pl-2">
                            <div className="text-xxs font-extrabold uppercase text-green-700 tracking-wider flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
                              Phase 2
                            </div>
                            <div className="flex flex-col gap-1 pl-3">
                              {phase2Projects.map((p) => (
                                <Link key={p.id} href={`/projects/${p.id}`} className="text-sm font-semibold text-gray-700 hover:text-green-700 transition">
                                  {p.title}
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Apartment category group */}
                    {apartmentProjects.length > 0 && (
                      <div className="space-y-1.5 text-left border-t border-gray-50 pt-3">
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Apartments</div>
                        <div className="flex flex-col gap-1 pl-2">
                          {apartmentProjects.map((p) => (
                            <Link key={p.id} href={`/projects/${p.id}`} className="text-sm font-semibold text-gray-700 hover:text-green-700 transition">
                              {p.title}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="border-t border-gray-100 pt-3 flex justify-between items-center text-xs">
                      <Link href="/projects" className="text-green-700 font-bold hover:underline flex items-center gap-1">
                        View All Projects
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium px-4 py-2 rounded-lg transition-all ${
                  isActive 
                    ? "text-green-700 bg-green-50 font-bold" 
                    : "text-gray-600 hover:text-green-700 hover:bg-gray-50"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:block">
          {onBookClick ? (
            <button
              onClick={onBookClick}
              className="bg-green-700 hover:bg-green-800 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm hover:shadow-md active:scale-95 flex items-center gap-1.5"
            >
              Book a Visit
              <ArrowUpRight className="h-4 w-4" />
            </button>
          ) : (
            <Link
              href="/contact"
              className="bg-green-700 hover:bg-green-800 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all inline-flex items-center gap-1.5 shadow-sm hover:shadow-md active:scale-95"
            >
              Book a Visit
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-gray-700 hover:text-green-700 p-2 rounded-lg hover:bg-gray-100 transition"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Nav Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-150 p-5 shadow-xl flex flex-col gap-3 animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            if (link.isProjectsDropdown) {
              return (
                <div key={link.name} className="flex flex-col gap-1">
                  <Link
                    href={link.href}
                    className={`text-base font-semibold px-4 py-2 rounded-lg ${
                      isActive 
                        ? "text-green-700 bg-green-50" 
                        : "text-gray-700 hover:text-green-700 hover:bg-gray-50"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                  <div className="pl-6 flex flex-col gap-2 py-1 border-l-2 border-gray-100 ml-4 text-left">
                    <Link href="/projects?category=phase1" className="text-sm font-semibold text-gray-500 hover:text-green-700 py-1" onClick={() => setIsMobileMenuOpen(false)}>
                      Phase 1
                    </Link>
                    <Link href="/projects?category=phase2" className="text-sm font-semibold text-gray-500 hover:text-green-700 py-1" onClick={() => setIsMobileMenuOpen(false)}>
                      Phase 2
                    </Link>
                    <Link href="/projects?category=apartment" className="text-sm font-semibold text-gray-500 hover:text-green-700 py-1" onClick={() => setIsMobileMenuOpen(false)}>
                      Apartments
                    </Link>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-base font-semibold px-4 py-3 rounded-lg ${
                  isActive 
                    ? "text-green-700 bg-green-50" 
                    : "text-gray-700 hover:text-green-700 hover:bg-gray-50"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            );
          })}
          {onBookClick ? (
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onBookClick();
              }}
              className="bg-green-700 text-white py-3.5 rounded-lg text-center font-bold mt-2 shadow-md hover:bg-green-800 active:scale-95 transition"
            >
              Book a Visit
            </button>
          ) : (
            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="bg-green-700 text-white py-3.5 rounded-lg text-center font-bold mt-2 shadow-md hover:bg-green-800 active:scale-95 transition"
            >
              Book a Visit
            </Link>
          )}
        </div>
      )}
    </header>
  );
}

