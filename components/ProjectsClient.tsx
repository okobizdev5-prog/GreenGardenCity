"use client";

import { useState, useEffect } from "react";
import { 
  Check, 
  MapPin, 
  Search, 
  AlertCircle,
  Sparkles,
  Image as ImageIcon,
  Compass,
  Home
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { BookingModal } from "@/components/BookingModal";

type Project = {
  id: string;
  title: string;
  description: string;
  images: string[];
  category?: string;
  status?: string;
};

type ProjectsClientProps = {
  initialProjects: Project[];
};

export function ProjectsClient({ initialProjects }: ProjectsClientProps) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedProjectTitle, setSelectedProjectTitle] = useState("General Inquiry");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMainCategory, setActiveMainCategory] = useState<"Land" | "Apartment">("Land");
  const [activeSubCategory, setActiveSubCategory] = useState<"All" | "Phase 1" | "Phase 2">("All");
  const [activeImageIndexes, setActiveImageIndexes] = useState<Record<string, number>>({});

  // Sync category status from URL parameter safely without de-optimizing SSG
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const categoryParam = params.get("category");
      if (categoryParam) {
        const paramLower = categoryParam.toLowerCase();
        if (paramLower === "phase1" || paramLower === "phase 1") {
          setActiveMainCategory("Land");
          setActiveSubCategory("Phase 1");
        } else if (paramLower === "phase2" || paramLower === "phase 2") {
          setActiveMainCategory("Land");
          setActiveSubCategory("Phase 2");
        } else if (paramLower === "flatbuysell" || paramLower === "flat buy/sell" || paramLower.includes("apartment")) {
          setActiveMainCategory("Apartment");
        } else if (paramLower === "land") {
          setActiveMainCategory("Land");
          setActiveSubCategory("All");
        }
      }
    }
  }, []);

  const handleBookVisit = (projectTitle: string) => {
    setSelectedProjectTitle(projectTitle);
    setIsBookingOpen(true);
  };

  // Helper to safely strip HTML tags for search comparison
  const getPlainText = (html: string) => {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  };

  // Filter projects dynamically
  const filteredProjects = initialProjects.filter((project) => {
    const textSnippet = getPlainText(project.description).toLowerCase();
    const query = searchQuery.toLowerCase();
    
    const matchesSearch = 
      project.title.toLowerCase().includes(query) ||
      textSnippet.includes(query);
      
    const categoryLower = (project.category || "").toLowerCase();
    const isApartment = categoryLower.includes("apartment") || categoryLower.includes("flat");
    const isLand = !isApartment;

    let matchesCategory = false;
    if (activeMainCategory === "Apartment") {
      matchesCategory = isApartment;
    } else {
      if (isLand) {
        if (activeSubCategory === "All") {
          matchesCategory = true;
        } else if (activeSubCategory === "Phase 1") {
          matchesCategory = categoryLower === "phase 1" || categoryLower.includes("phase 1");
        } else if (activeSubCategory === "Phase 2") {
          matchesCategory = categoryLower === "phase 2" || categoryLower.includes("phase 2");
        }
      }
    }

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar onBookClick={() => handleBookVisit("General Inquiry")} />

      {/* Main Content */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 md:px-8 py-24 md:py-32 space-y-12">
        {/* Header */}
        <header className="space-y-4 max-w-3xl">
          <span className="text-sm font-bold text-green-700 uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-amber-500" /> Showcase Portfolio
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-green-900 tracking-tight leading-tight">
            Our Master Projects
          </h1>
          <p className="text-gray-600 text-lg md:text-xl font-light leading-relaxed">
            Explore our curated residential masterplans, commercial spaces, and premium villa architectures in Green Garden City.
          </p>
        </header>

        {/* Search Bar Panel */}
        <section className="bg-white p-5 rounded-2xl border border-gray-200/60 shadow-sm flex items-center justify-between gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 h-4.5 w-4.5" />
            <input 
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition text-sm font-medium text-gray-700" 
              placeholder="Search projects by title, amenities, keywords..." 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="text-xs font-semibold text-green-700 hover:text-green-800 transition"
            >
              Clear Search
            </button>
          )}
        </section>

        {/* Main Categories Switcher */}
        <div className="flex border-b border-gray-200 gap-1 sm:gap-2">
          <button
            onClick={() => {
              setActiveMainCategory("Land");
              setActiveSubCategory("All");
            }}
            className={`flex items-center gap-2 px-4 sm:px-6 py-3.5 text-sm sm:text-base font-bold transition-all border-b-2 -mb-[2px] relative ${
              activeMainCategory === "Land"
                ? "text-green-700 border-green-700 font-extrabold"
                : "text-gray-500 border-transparent hover:text-green-700 hover:bg-gray-50/50 rounded-t-xl"
            }`}
          >
            <Compass className="h-4.5 w-4.5 text-current" />
            Land Projects
          </button>
          <button
            onClick={() => {
              setActiveMainCategory("Apartment");
            }}
            className={`flex items-center gap-2 px-4 sm:px-6 py-3.5 text-sm sm:text-base font-bold transition-all border-b-2 -mb-[2px] relative ${
              activeMainCategory === "Apartment"
                ? "text-green-700 border-green-700 font-extrabold"
                : "text-gray-500 border-transparent hover:text-green-700 hover:bg-gray-50/50 rounded-t-xl"
            }`}
          >
            <Home className="h-4.5 w-4.5 text-current" />
            Apartments
          </button>
        </div>

        {/* Subcategories for Land (only shown if main category is Land) */}
        {activeMainCategory === "Land" && (
          <div className="flex flex-wrap gap-2 pt-1 animate-in fade-in duration-200">
            {["All", "Phase 1", "Phase 2"].map((subTab) => {
              const isActive = activeSubCategory === subTab;
              return (
                <button
                  key={subTab}
                  onClick={() => setActiveSubCategory(subTab as "All" | "Phase 1" | "Phase 2")}
                  className={`px-4 py-2 text-xs font-bold rounded-lg border transition ${
                    isActive
                      ? "bg-green-700 border-green-800 text-white shadow-xs"
                      : "bg-white border-gray-250 text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                  }`}
                >
                  {subTab === "All" ? "All Phases" : subTab}
                </button>
              );
            })}
          </div>
        )}

        {/* Project Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => {
            const activeIdx = activeImageIndexes[project.id] || 0;
            const currentImg = project.images && project.images.length > 0 ? project.images[activeIdx] : null;
            const hasMultipleImages = project.images && project.images.length > 1;

            const prevSlide = (e: React.MouseEvent) => {
              e.stopPropagation();
              if (!project.images || project.images.length === 0) return;
              setActiveImageIndexes(prev => ({
                ...prev,
                [project.id]: (activeIdx - 1 + project.images.length) % project.images.length
              }));
            };

            const nextSlide = (e: React.MouseEvent) => {
              e.stopPropagation();
              if (!project.images || project.images.length === 0) return;
              setActiveImageIndexes(prev => ({
                ...prev,
                [project.id]: (activeIdx + 1) % project.images.length
              }));
            };

            return (
              <article 
                key={project.id} 
                className="bg-white rounded-2xl overflow-hidden border border-gray-200/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group"
              >
                {/* Project Image Slider Cover */}
                <div className="relative aspect-video w-full overflow-hidden bg-gray-100 group/slider">
                  {/* Floating Status Badge */}
                  {project.status && (
                    <div className="absolute top-3.5 left-3.5 z-20">
                      <span className={`px-2.5 py-1 rounded-lg text-xxs font-extrabold uppercase tracking-wider shadow-sm border ${
                        project.status === "Upcoming" ? "bg-amber-500 text-white border-amber-400" :
                        project.status === "Delivered" ? "bg-green-600 text-white border-green-500" :
                        "bg-blue-600 text-white border-blue-500"
                      }`}>
                        {project.status}
                      </span>
                    </div>
                  )}

                  <a href={`/projects/${project.id}`} className="block w-full h-full">
                    {currentImg ? (
                      <img 
                        src={currentImg} 
                        alt={project.title} 
                        className="w-full h-full object-cover transition duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                        <ImageIcon className="h-12 w-12 text-gray-300 mb-2" />
                        <span className="text-xs">No image uploaded</span>
                      </div>
                    )}
                  </a>

                  {/* Slider Arrows */}
                  {hasMultipleImages && (
                    <>
                      <button
                        onClick={prevSlide}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-green-700 text-white rounded-full p-1.5 transition opacity-0 group-hover/slider:opacity-100 shadow-sm z-10"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                      </button>
                      <button
                        onClick={nextSlide}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-green-700 text-white rounded-full p-1.5 transition opacity-0 group-hover/slider:opacity-100 shadow-sm z-10"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                      </button>

                      {/* Carousel Indicator Dots */}
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/45 px-2.5 py-1 rounded-full backdrop-blur-xs z-10">
                        {project.images.map((_, dotIdx) => (
                          <span 
                            key={dotIdx} 
                            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                              dotIdx === activeIdx ? "bg-white scale-125" : "bg-white/50"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Card Details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <a href={`/projects/${project.id}`} className="hover:text-green-800 transition block">
                      <h3 className="text-xl font-bold text-gray-900 leading-tight hover:text-green-800">
                        {project.title}
                      </h3>
                    </a>
                    
                    {/* Safe HTML rendering */}
                    <div 
                      className="text-sm text-gray-600 line-clamp-5 prose prose-sm prose-green max-w-none leading-relaxed mt-2"
                      dangerouslySetInnerHTML={{ __html: project.description }}
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <a 
                      href={`/projects/${project.id}`}
                      className="flex-1 bg-white hover:bg-gray-50 text-green-800 border border-green-200 font-semibold py-2.5 rounded-lg shadow-xs transition text-center text-xs flex items-center justify-center"
                    >
                      View Details
                    </a>
                    <button 
                      onClick={() => handleBookVisit(project.title)}
                      className="flex-1 bg-green-700 hover:bg-green-800 text-white font-semibold py-2.5 rounded-lg shadow-xs hover:shadow-md transition text-center text-xs"
                    >
                      Book Visit
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        {/* Empty Search Result State */}
        {filteredProjects.length === 0 && (
          <div className="p-16 border-2 border-dashed border-gray-200 rounded-2xl text-center space-y-4 max-w-md mx-auto">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto" />
            <h3 className="text-lg font-bold text-gray-900">No projects found</h3>
            <p className="text-gray-500 text-sm">
              We couldn't find any development blueprints matching "{searchQuery}". Try searching for other terms like "villa", "square", or "residences".
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="bg-green-700 hover:bg-green-800 text-white font-semibold px-5 py-2 rounded-lg text-sm transition"
            >
              Clear Search Query
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-green-950 text-gray-300 pt-16 pb-8 border-t border-green-900">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl grid grid-cols-1 md:grid-cols-3 items-center gap-8 mb-12">
          <div className="text-xl font-bold text-white tracking-wide">Green Garden City</div>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <a href="#" className="hover:text-amber-400 transition">Privacy Policy</a>
            <a href="#" className="hover:text-amber-400 transition">Terms of Service</a>
            <a href="/contact" className="hover:text-amber-400 transition">Contact Us</a>
          </div>
          <div className="text-sm text-center md:text-right text-green-100/50">
            &copy; {new Date().getFullYear()} Green Garden City. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Booking scheduling modal */}
      <BookingModal 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
        initialPlot={selectedProjectTitle}
      />
    </div>
  );
}
