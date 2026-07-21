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

  // Accordion open states for mobile view
  const [mobileLandOpen, setMobileLandOpen] = useState(false);
  const [mobileApartmentOpen, setMobileApartmentOpen] = useState(false);
  const [mobileLandStatusOpen, setMobileLandStatusOpen] = useState<Record<string, boolean>>({
    Ongoing: false,
    Upcoming: false,
    Delivered: false
  });
  const [mobileApartmentStatusOpen, setMobileApartmentStatusOpen] = useState<Record<string, boolean>>({
    Ongoing: false,
    Upcoming: false,
    Delivered: false
  });

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
    { name: "Land Projects", href: "/projects?category=land", isLandDropdown: true },
    { name: "Apartments", href: "/projects?category=apartment", isApartmentDropdown: true },
    { name: "Blog", href: "/blog" },
    { name: "Brochures", href: "/brochures" },
    { name: "Contact Us", href: "/contact" },
  ];

  const statuses = ["Ongoing", "Upcoming", "Delivered"];

  const landProjects = projects.filter(p => {
    const cat = (p.category || "").toLowerCase();
    return !cat.includes("apartment") && !cat.includes("flat");
  });

  const dynamicLandCategories = Array.from(
    new Set(landProjects.map(p => p.category || "Land - Phase 1"))
  );

  const getLandProjects = (status: string, phaseCategory: string) => {
    return landProjects.filter(p => {
      const isStatusMatch = (p.status || "").toLowerCase() === status.toLowerCase();
      const catLower = (p.category || "").toLowerCase();
      const targetLower = phaseCategory.toLowerCase();
      const isPhaseMatch = catLower === targetLower || catLower.includes(targetLower) || targetLower.includes(catLower);
      return isStatusMatch && isPhaseMatch;
    });
  };

  const apartmentProjects = projects.filter(p => {
    const cat = (p.category || "").toLowerCase();
    return cat.includes("apartment") || cat.includes("flat");
  });

  const getApartmentProjects = (status: string) => {
    return apartmentProjects.filter(
      p => (p.status || "").toLowerCase() === status.toLowerCase()
    );
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm py-3 border-b border-gray-100"
          : "bg-white py-4"
        }`}
    >
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center max-w-7xl">
        <Link href="/" className="font-bold text-2xl text-green-700 tracking-tight flex items-center gap-1 hover:opacity-90">
          Greenleaf Holdings Ltd.
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1.5">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            if (link.isLandDropdown) {
              return (
                <div key={link.name} className="relative group py-2">
                  <Link
                    href={link.href}
                    className={`text-sm font-medium px-4 py-2 rounded-lg transition-all inline-flex items-center gap-1 ${isActive || pathname.includes("category=land")
                        ? "text-green-700 bg-green-50 font-bold"
                        : "text-gray-600 hover:text-green-700 hover:bg-gray-50"
                      }`}
                  >
                    {link.name}
                    <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180 text-gray-400 group-hover:text-green-700" />
                  </Link>

                  {/* Dropdown Menu for Land */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[600px] bg-white border border-gray-150 rounded-2xl shadow-xl py-6 px-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 grid grid-cols-3 gap-6">
                    {statuses.map((status) => {
                      const statusProjs = landProjects.filter(
                        (p) => (p.status || "").toLowerCase() === status.toLowerCase()
                      );
                      const hasProjects = statusProjs.length > 0;

                      return (
                        <div key={status} className="space-y-4 text-left">
                          <h4 className="text-xs font-extrabold text-green-800 uppercase tracking-wider border-b border-gray-100 pb-1.5 flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${status === "Ongoing" ? "bg-blue-500 animate-pulse" :
                                status === "Upcoming" ? "bg-amber-500" :
                                  "bg-green-500"
                              }`} />
                            {status}
                          </h4>

                          {hasProjects ? (
                            <div className="space-y-3">
                              {dynamicLandCategories.map((cat) => {
                                const catProjs = getLandProjects(status, cat);
                                if (catProjs.length === 0) return null;

                                return (
                                  <div key={cat} className="space-y-1">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">{cat}</span>
                                    <div className="flex flex-col gap-1 pl-1">
                                      {catProjs.map((p) => (
                                        <Link key={p.id} href={`/projects/${p.id}`} className="text-sm font-semibold text-gray-700 hover:text-green-700 transition line-clamp-1">
                                          {p.title}
                                        </Link>
                                      ))}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <span className="text-xs font-semibold text-gray-400 italic">No projects yet</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            }

            if (link.isApartmentDropdown) {
              return (
                <div key={link.name} className="relative group py-2">
                  <Link
                    href={link.href}
                    className={`text-sm font-medium px-4 py-2 rounded-lg transition-all inline-flex items-center gap-1 ${isActive || pathname.includes("category=apartment")
                        ? "text-green-700 bg-green-50 font-bold"
                        : "text-gray-600 hover:text-green-700 hover:bg-gray-50"
                      }`}
                  >
                    {link.name}
                    <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180 text-gray-400 group-hover:text-green-700" />
                  </Link>

                  {/* Dropdown Menu for Apartments */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[550px] bg-white border border-gray-150 rounded-2xl shadow-xl py-6 px-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 grid grid-cols-3 gap-6">
                    {statuses.map((status) => {
                      const projs = getApartmentProjects(status);
                      const hasProjects = projs.length > 0;

                      return (
                        <div key={status} className="space-y-4 text-left">
                          <h4 className="text-xs font-extrabold text-green-800 uppercase tracking-wider border-b border-gray-100 pb-1.5 flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${status === "Ongoing" ? "bg-blue-500 animate-pulse" :
                                status === "Upcoming" ? "bg-amber-500" :
                                  "bg-green-500"
                              }`} />
                            {status}
                          </h4>

                          {hasProjects ? (
                            <div className="flex flex-col gap-1.5 pl-1">
                              {projs.map((p) => (
                                <Link key={p.id} href={`/projects/${p.id}`} className="text-sm font-semibold text-gray-700 hover:text-green-700 transition line-clamp-1">
                                  {p.title}
                                </Link>
                              ))}
                            </div>
                          ) : (
                            <span className="text-xs font-semibold text-gray-400 italic">No apartments yet</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium px-4 py-2 rounded-lg transition-all ${isActive
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
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-150 p-5 shadow-xl flex flex-col gap-3 animate-in slide-in-from-top duration-200 max-h-[85vh] overflow-y-auto">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            if (link.isLandDropdown) {
              return (
                <div key={link.name} className="flex flex-col gap-1 border-b border-gray-100 pb-2">
                  <button
                    onClick={() => setMobileLandOpen(!mobileLandOpen)}
                    className="flex justify-between items-center w-full text-left text-base font-semibold px-4 py-2.5 rounded-lg text-gray-700 hover:text-green-700 hover:bg-gray-50 transition"
                  >
                    <span>{link.name}</span>
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${mobileLandOpen ? "rotate-180 text-green-700" : "text-gray-400"}`} />
                  </button>

                  {mobileLandOpen && (
                    <div className="pl-4 flex flex-col gap-2.5 py-2.5 border-l-2 border-green-700/30 ml-4 animate-in slide-in-from-top-2 duration-200">
                      {statuses.map((status) => {
                        const statusProjs = landProjects.filter(
                          (p) => (p.status || "").toLowerCase() === status.toLowerCase()
                        );
                        const hasProjects = statusProjs.length > 0;
                        const isStatusOpen = !!mobileLandStatusOpen[status];

                        return (
                          <div key={status} className="flex flex-col gap-1">
                            <button
                              onClick={() => setMobileLandStatusOpen(prev => ({ ...prev, [status]: !isStatusOpen }))}
                              className="flex justify-between items-center w-full text-left text-sm font-bold text-green-800 px-3 py-1.5 hover:bg-gray-50/50 rounded-md transition"
                            >
                              <span className="flex items-center gap-1.5">
                                <span className={`w-1.5 h-1.5 rounded-full ${status === "Ongoing" ? "bg-blue-500" :
                                    status === "Upcoming" ? "bg-amber-500" :
                                      "bg-green-500"
                                  }`} />
                                {status}
                              </span>
                              <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${isStatusOpen ? "rotate-180" : ""}`} />
                            </button>

                            {isStatusOpen && (
                              <div className="pl-4 flex flex-col gap-2 mt-1 animate-in slide-in-from-top-1 duration-150">
                                {hasProjects ? (
                                  <>
                                    {dynamicLandCategories.map((cat) => {
                                      const catProjs = getLandProjects(status, cat);
                                      if (catProjs.length === 0) return null;

                                      return (
                                        <div key={cat} className="space-y-1">
                                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">{cat}</span>
                                          {catProjs.map((p) => (
                                            <Link
                                              key={p.id}
                                              href={`/projects/${p.id}`}
                                              className="text-xs font-semibold text-gray-650 hover:text-green-700 block py-0.5"
                                              onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                              {p.title}
                                            </Link>
                                          ))}
                                        </div>
                                      );
                                    })}
                                  </>
                                ) : (
                                  <span className="text-xs font-medium text-gray-400 italic py-1">No projects available</span>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            if (link.isApartmentDropdown) {
              return (
                <div key={link.name} className="flex flex-col gap-1 border-b border-gray-100 pb-2">
                  <button
                    onClick={() => setMobileApartmentOpen(!mobileApartmentOpen)}
                    className="flex justify-between items-center w-full text-left text-base font-semibold px-4 py-2.5 rounded-lg text-gray-750 hover:text-green-750 hover:bg-gray-50 transition"
                  >
                    <span>{link.name}</span>
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${mobileApartmentOpen ? "rotate-180 text-green-700" : "text-gray-400"}`} />
                  </button>

                  {mobileApartmentOpen && (
                    <div className="pl-4 flex flex-col gap-2.5 py-2.5 border-l-2 border-green-700/30 ml-4 animate-in slide-in-from-top-2 duration-200">
                      {statuses.map((status) => {
                        const projs = getApartmentProjects(status);
                        const hasProjects = projs.length > 0;
                        const isStatusOpen = !!mobileApartmentStatusOpen[status];

                        return (
                          <div key={status} className="flex flex-col gap-1">
                            <button
                              onClick={() => setMobileApartmentStatusOpen(prev => ({ ...prev, [status]: !isStatusOpen }))}
                              className="flex justify-between items-center w-full text-left text-sm font-bold text-green-800 px-3 py-1.5 hover:bg-gray-50/50 rounded-md transition"
                            >
                              <span className="flex items-center gap-1.5">
                                <span className={`w-1.5 h-1.5 rounded-full ${status === "Ongoing" ? "bg-blue-500" :
                                    status === "Upcoming" ? "bg-amber-500" :
                                      "bg-green-500"
                                  }`} />
                                {status}
                              </span>
                              <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${isStatusOpen ? "rotate-180" : ""}`} />
                            </button>

                            {isStatusOpen && (
                              <div className="pl-4 flex flex-col gap-1.5 mt-1 animate-in slide-in-from-top-1 duration-150">
                                {hasProjects ? (
                                  projs.map((p) => (
                                    <Link
                                      key={p.id}
                                      href={`/projects/${p.id}`}
                                      className="text-xs font-semibold text-gray-650 hover:text-green-700 block py-0.5"
                                      onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                      {p.title}
                                    </Link>
                                  ))
                                ) : (
                                  <span className="text-xs text-gray-400 italic pl-2">No apartments yet</span>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-base font-semibold px-4 py-3 rounded-lg ${isActive
                    ? "text-green-700 bg-green-50 font-bold"
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
              className="bg-green-700 text-white py-3.5 rounded-lg text-center font-bold mt-2 shadow-md hover:bg-green-800 active:scale-95 transition shrink-0"
            >
              Book a Visit
            </button>
          ) : (
            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="bg-green-700 text-white py-3.5 rounded-lg text-center font-bold mt-2 shadow-md hover:bg-green-800 active:scale-95 transition shrink-0"
            >
              Book a Visit
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
